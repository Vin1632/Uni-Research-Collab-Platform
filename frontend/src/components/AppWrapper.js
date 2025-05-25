import "../styles/AppWrapper.css";
import "../styles/Dashboard.css";
import Header from "./Header";



export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat, isInChat }) => {

  return (
    <main className="dashboard-wrapper">
      {!isInChat && (
        <Header />
      )}
      <div className="app-container">{children}</div>
      
    </main>
  );
};