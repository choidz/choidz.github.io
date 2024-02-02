import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting
import { NotionRenderer } from "react-notion";
import response from "../../data/dob.json"; // https://www.notion.so/api/v3/loadPageChunk

const Modal = ({ title, link, date, skills, projectPic }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="bg-white overflow-auto h-full">
          <NotionRenderer className="" 
          // 웹페이지에 노션을 렌더링
            blockMap={response} // 페이지정보 넣기
            fullPage={true}
          />
        </div>
        {/* <button className="close-btn" onClick={()=> handleClose()}>Close</button>  */}
      </div>
    </div>
  );
};

export default Modal;
