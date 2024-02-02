import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting
import { NotionRenderer } from "react-notion";
import response from "../../data/dob.json"; // https://www.notion.so/api/v3/loadPageChunk


function ProjectModal() {
  return (
    <div className="App">
      <NotionRenderer // 웹페이지에 노션을 렌더링
        blockMap={response} // 페이지정보 넣기
        fullPage={true}
      />
    </div>
  );
}

export default ProjectModal;
