import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../store";
import config from "../config/config";
import { download, logoShirt, stylishShirt } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import Tab from "../components/Tab";
import { fade } from "maath/dist/declarations/src/misc";
import CustomButton from "../components/CustomButton";
import ColorPicker from "../components/ColorPicker";
import FilePicker from "../components/FilePicker";
import AIPicker from "../components/AIPicker";
import { stringify } from "postcss";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");

  const [prompt, setPrompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);

  const [activeEditorTab, setactiveEditorTab] = useState("");
  const [activeFilterTab, setactiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter the prompt");

    try {
      setgeneratingImg(true);
      const response = await fetch("http://localhost:5000/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setgeneratingImg(false);
      setactiveEditorTab("");
    }
  };

  const handleDecals = (type, result) => {
    const DecalType = DecalTypes[type];

    state[DecalType.stateProperty] = result;

    if (!activeFilterTab[DecalType.filterTab]) {
      handleActiveFilterTab(DecalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName: string) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    setactiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setactiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key={`custom`}
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    isActiveTab=""
                    isFiltered
                    tab={tab}
                    handleClick={() => setactiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              styles="w-fit px-4 py-2.5 font-bold text-sm"
            ></CustomButton>
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                isActiveTab={activeFilterTab[tab.name]}
                isFiltered
                tab={tab}
                handleClick={() => {
                  handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
