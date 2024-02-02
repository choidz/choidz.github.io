/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
// import Modal from "../Modal/Modal";
// import ProjectInfo from "../ProjectSection";

// const Card = ({ id, title, link, date, skills, projectPic }) => {
//   const [showModal, setShowModal] = useState(false);
//   const handleClose = () => {
//     setShowModal(false);
//   };

export default function Card() {

  return (
    <div className="flex flex-col gap-y-4 items-center mb-16">
      {/* <div className="flex flex-row items-center gap-x-16">
        <button
          className="flex flex-col items-center bg-white border border-gray-200 max-w-80 rounded-lg shadow md:flex-col  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={() => setShowModal(true)}
        >
          <div>
            <img
              className="object-fit w-full rounded-t-lg h-96 md:h-auto md:w-fit md:rounded-none md:rounded-s-lg p-4 "
              src={projectPic}
              alt="profile picture"
            />
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {title}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {date}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {skills.map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            </p>
            <p className="name">{link}</p>
          </div>
        </button>
      </div> */}
    </div>
  );
};

