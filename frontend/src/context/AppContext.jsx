import { createContext, useState, useNavigate } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    // You can add any global state or functions here that you want to provide to your components
    // For example, you might want to manage user authentication, theme settings, etc.

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const[isClinic, setIsClinic] = useState(false);
    //const[showUserLogin, setShowUserLogin] = useState(false);

    const value = {user, setUser, isClinic, setIsClinic, navigate};

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

}

export const useAppContext = () => {
    return useContext(AppContext);
}
