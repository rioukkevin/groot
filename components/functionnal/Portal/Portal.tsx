import ReactDOM from "react-dom";

//@ts-ignore
const Portal = (Component) => (props) => {
  return ReactDOM.createPortal(<Component {...props} />, window.document.body);
};

export default Portal;
