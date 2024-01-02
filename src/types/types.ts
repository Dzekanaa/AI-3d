export interface CustomButtonProps {
    type: string,
    title: string,
    styles: string,
    handleClick: () => void;
}

export interface TabProps {
    tab: {name: string, icon: string}
    isFiltered: boolean,
    isActiveTab: string,
    handleClick: () => void
}