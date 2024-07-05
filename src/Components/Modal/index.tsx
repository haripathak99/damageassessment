///modal
import PropTypes from "prop-types";
const Modal = ({ children }) => (
  <>
    <div className="backdrop fixed top-0 left-0 w-full bg-black opacity-70 z-[99999] h-[100vh] " />
    <div className="content z-[99999] fixed top-[10vh] mx-[20%] ">
      {children}
    </div>
  </>
);
Modal.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Modal;
