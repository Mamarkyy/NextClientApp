import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import DateConverter from "@/lib/dateConverter";
import FormatHelper from "@/lib/formatHelper";
import AvailabilityInfo from "@/layout/components/employer/worker-search/AvailabilityInfo";
import { LocationService } from "@/layout/service/LocationService";

const ShowWorkerDetailsBtn = ({ worker, distances }) => {
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState([]);
  const dateConverter = DateConverter();

  // TO BE TESTED
  const availability = {
    Monday: true,
    Tuesday: false,
    Wednesday: true,
    Thursday: true,
    Friday: false,
    Saturday: false,
    Sunday: true,
  };

  const formatHelper = FormatHelper();
  const languagesString = formatHelper.convertArrayToString(worker.languages);
  const servicesString = formatHelper.convertArrayToString(
    worker.services,
    "service_name"
  );

  return (
    <>
      <Button
        label="View Profile"
        className="p-button-sm p-button-secondary"
        onClick={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        className="w-full md:w-8 border-solid border-1 border-black-alpha-90"
        onHide={() => setVisible(false)}
      >
        <div className="mx-3">
          <div className="grid">
            <div className="col-5">
              <center>
                <Avatar
                  image={worker.profile_url || "/layout/profile-default.png"}
                  alt="profile"
                  shape="circle"
                  className="h-8rem w-8rem md:w-8rem md:h-8rem shadow-2 cursor-pointer"
                />
                <div className="flex flex-column align-items-center">
                  <h1 className="my-2">
                    {worker.first_name + " " + worker.last_name}
                  </h1>
                  <div className="flex align-items-center mb-2">
                    <Rating value={0} readOnly cancel={false} />
                  </div>
                  <label className="text-base">
                    ₱ {worker.hourly_rate} / hr
                  </label>
                  <label className="block mb-2">
                    <i className="pi pi-map-marker" />{" "}
                    {LocationService.getDistance(
                      worker.city_municipality,
                      distances
                    )}{" "}
                    Kilometers - {worker.city_municipality}
                  </label>
                </div>
                <div className="btn-action-container">
                  <Button
                    className="p-mt-2 p-w-13"
                    outlined
                    label="Hire Nanny"
                    rounded
                  />
                </div>
              </center>
            </div>
            <div className="col">
              <div className="flex flex-column md:flex-row flex-wrap">
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-book" /> Languages Spoken
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {" "}
                    {languagesString}
                  </label>
                </div>
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-check-circle" /> Services Offered
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {" "}
                    {servicesString}
                  </label>
                </div>
                <div className="pr-1" style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-briefcase" /> Experiences
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {/* Experience 1 <br />
                                    Experience 2 */}
                    {worker.work_experience}
                  </label>
                </div>
                <div style={{ flexBasis: "50%" }}>
                  <label style={{ fontWeight: "bold" }}>
                    <i className="pi pi-calendar" /> Availability
                  </label>
                  <label style={{ display: "block", paddingBottom: "2vh" }}>
                    {" "}
                    {worker.availability}
                  </label>
                  {/* <AvailabilityInfo availability={availability}/> */}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>
              <i className="pi pi-megaphone" /> Bio
            </label>
            <label style={{ display: "block", paddingBottom: "2vh" }}>
              {worker.bio}
            </label>
          </div>

          {/* DOCUMENTS PART SUCH AS RESUME, BRGY CLEARANCE, ETC. */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            {worker.documents &&
              worker.documents.map((document, index) => (
                <div
                  key={index}
                  className="mb-2 flex align-content-center justify-content-between border-1 border-round border-400 p-4"
                >
                  <Dialog
                    header="Document Preview"
                    maximizable
                    visible={dialogVisible}
                    className="w-5 h-screen"
                    onHide={() => setDialogVisible(false)}
                  >
                    <div className="flex w-full relative flex flex-column">
                      {/* Check how many urls are there in selectedDocUrl, then renders the image*/}
                      {selectedDocUrl &&
                        selectedDocUrl.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt=""
                            className="w-full border-round border-solid border-1 mb-2"
                          />
                        ))}

                      {/* Cover to prevent right clicking */}
                      <div className="absolute top-0 bottom-0 left-0 right-0 "></div>
                    </div>
                  </Dialog>
                  <div>
                    <i
                      className="pi pi-file mr-3"
                      style={{ fontSize: "1.3rem" }}
                    ></i>
                    <span className="font-semibold">
                      {document.type.toUpperCase()}:{" "}
                    </span>
                    <span>{document.status}</span>
                  </div>
                  {document.fileUrl && (
                    <a
                      // href={document.fileUrl}
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(document.fileUrl);
                        setSelectedDocUrl(document.fileUrl); // stores an array of URLs
                        setDialogVisible(true);
                      }}
                    >
                      View Document
                      <i className="pi pi-arrow-up-right mx-3 text-base"></i>
                    </a>
                  )}
                </div>
              ))}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ShowWorkerDetailsBtn;
