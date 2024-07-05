import Modal from "../../Components/Modal/index";
import "./styles.css";
import BheemdattaBanner from "../../assets/bheemdatta_sideBanner.jpg";
import { useState } from "react";
import close from "../../assets/close.png";

function WelcomeMsg() {
  const [buttonOpen, setButtonOpen] = useState(true);
  const closeAction = () => {
    setButtonOpen(false);
  };
  return (
    <div className={buttonOpen ? `block` : `hidden`}>
      <Modal>
        <div className="popup-container w-full` : `hidden">
          <div className="cover-popup w-full">
            <div className="left-image w-1/2 ">
              <img
                className="image cursor-pointer"
                src={BheemdattaBanner}
                alt=""
              />
            </div>
            <div className="right-container w-4/5">
              <div className="rightcover gap-0">
                <div className="closebutton m-3 p-0">
                  <img
                    src={close}
                    alt=""
                    height={13}
                    width={13}
                    onClick={() => closeAction()}
                    className="border-solid cursor-pointer"
                  />
                </div>
                <div className="right-content flex  h-full ">
                  <div className="cover-right px-20 gap-4   h-full   flex  flex-col items-start justify-center">
                    <h3 className="text-red-500 text-3xl font-semibold -mt-4 fraunces-normal">
                      Building Damage Assessment (BDA)
                    </h3>
                    <div>
                      <p className=" text-lg  text-black font-normal lg:text-base">
                        BDA is the process of evaluating and documenting the
                        structural integrity and condition of a building after
                        it has been subjected to a natural disaster, accident,
                        fire, or any other event that may have caused damage. It
                        is typically conducted by qualified professionals such
                        as structural engineers, building inspectors, or
                        disaster assessment teams. It involves a systematic
                        approach to ensure thorough evaluation and accurate
                        reporting of the building's condition post-event.
                      </p>
                    </div>
                    <button
                      className="w-56 bg-red-600 text-white md:p-0 md:w-32 rounded-md font-bold   xs:h-18 h-10 hover:underline hover:bg-red-700"
                      onClick={() => closeAction()}
                      type="button"
                    >
                      Explore Map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default WelcomeMsg;
