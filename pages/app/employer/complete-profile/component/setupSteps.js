import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { PaymentService } from "@/layout/service/PaymentService";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import FileUploader from "@/layout/components/FileUploader";

const HouseholdInformationStep = ({
  handleNextStep,
  handlePreviousStep,
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  return (
    <div>
      <div className="flex">
        <div className="household-num-selection">
          <label
            htmlFor="householdSize"
            className="block text-900 font-medium mb-2"
          >
            Household Size
          </label>
          {/* <InputText
            {...props.formik.getFieldProps("householdSize")}
            id="householdSize"
            type="text"
            placeholder="Enter you household size"
            className={classNames("w-full", {
              "p-invalid": isFormFieldInvalid("householdSize"),
            })}
          /> */}

          <div className="pr-4">
            <InputNumber
              id="householdSize"
              value={formik.values.householdSize}
              onValueChange={(e) => {
                formik.setFieldValue("householdSize", e.value);
              }}
              placeholder="Enter your household size"
              className={classNames("w-full", {
                "p-invalid": isFormFieldInvalid("householdSize"),
              })}
            />
          </div>
          {getFormErrorMessage("householdSize")}
        </div>

        <div className="pet-selection">
          <label htmlFor="hasPets" className="block text-900 font-medium mb-2">
            Employer Pets
          </label>
          <div className="flex flex-wrap justify-content-center gap-3 mt-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="dog"
                name="pets"
                value={formik.values.pets.dog}
                onChange={(e) => {
                  formik.setFieldValue("pets.dog", e.checked);
                }}
                checked={formik.values.pets.dog}
              />
              <label htmlFor="dog" className="ml-2">
                Dog
              </label>
            </div>
            <div className="flex align-items-center">
              <Checkbox
                inputId="cat"
                name="pets"
                value={formik.values.pets.cat}
                onChange={(e) => {
                  formik.setFieldValue("pets.cat", e.checked);
                }}
                checked={formik.values.pets.cat}
              />
              <label htmlFor="cat" className="ml-2">
                Cat
              </label>
            </div>
            <div className="flex align-items-center">
              <Checkbox
                inputId="other"
                name="pets"
                value={formik.values.pets.otherPets}
                onChange={(e) => {
                  formik.setFieldValue("pets.otherPets", e.checked);
                }}
                checked={formik.values.pets.otherPets}
              />
              <label htmlFor="other" className="ml-2">
                Other Pets
              </label>
            </div>
          </div>
          {getFormErrorMessage("hasPets")}
        </div>
      </div>

      <label
        htmlFor="specificNeeds"
        className="block text-900 font-medium mb-2"
      >
        Specific Needs
      </label>
      <InputText
        {...props.formik.getFieldProps("specificNeeds")}
        id="specificNeeds"
        type="text"
        placeholder="Enter any specific needs in mind"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("specificNeeds"),
        })}
      />
      {getFormErrorMessage("specificNeeds")}

      <div className="flex flex-wrap justify-content-end gap-2 mt-4">
        <Button
          label="Next"
          className="align-content-center"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
          //   Check if householdSize is not empty, disable the next button
          disabled={!formik.values.householdSize}
        />
      </div>
    </div>
  );
};

const PaymentStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredPayOptions;

      if (!event.query.trim().length) {
        _filteredPayOptions = [...payments];
      } else {
        _filteredPayOptions = payments.filter((payment) => {
          return payment.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredPayments(_filteredPayOptions);
    }, 250);
  };

  useEffect(() => {
    PaymentService.getPaymentMethods().then((data) => setPayments(data));
    PaymentService.getFrequencyOfPayments().then((data) => setOptions(data));
  }, []);

  const handleSelectedPaymentChange = (e) => {
    formik.setFieldValue("paymentMethods", e.value);
  };

  const handleSelectedFrequencyChange = (e) => {
    formik.setFieldValue("paymentFrequency", e.value);
  };

  return (
    <div>
      <label
        htmlFor="paymentMethods"
        className="block text-900 font-medium mb-2"
      >
        Payment Methods
      </label>
      <div className="p-fluid">
        <AutoComplete
          placeholder="Select preferred mode of payment"
          value={formik.values.paymentMethods}
          field="name"
          multiple
          dropdown
          virtualScrollerOptions={{ itemSize: 38 }}
          suggestions={filteredPayments}
          completeMethod={search}
          onChange={handleSelectedPaymentChange}
        />
      </div>
      {getFormErrorMessage("paymentMethods")}

      <label
        htmlFor="paymentFrequency"
        className="block text-900 font-medium mb-2"
      >
        Preferred Frequency of Pay
      </label>
      <div className="p-fluid">
        <Dropdown
          placeholder="Select Frequency of Pay"
          value={formik.values.paymentFrequency}
          id="paymentFrequency"
          options={options.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          onChange={handleSelectedFrequencyChange}
        />
      </div>
      {getFormErrorMessage("paymentFrequency")}

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Next"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
          //   Check if both paymentMethods and paymentFrequency is not empty, disable the next button
          disabled={
            !formik.values.paymentMethods.length ||
            !formik.values.paymentFrequency
          }
        />
      </div>
    </div>
  );
};

const AdditionalStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;

  return (
    <div>
      <label htmlFor="bio" className="block text-900 font-medium mb-2">
        Bio{" "}
      </label>
      <InputTextarea
        style={{ width: "100%", height: "200px" }}
        {...props.formik.getFieldProps("bio")}
        id="bio"
        type="text"
        placeholder="Create a bio"
        className={classNames("w-full", {
          "p-invalid": isFormFieldInvalid("bio"),
        })}
      />
      {getFormErrorMessage("bio")}

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Skip"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={handleNextStep}
        />
      </div>
    </div>
  );
};

const VerificationStep = ({ handleNextStep, handlePreviousStep, ...props }) => {
  const { isFormFieldInvalid, getFormErrorMessage, formik } = props;
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState(null);

  const itemTemplate = (file, props) => {
    const { uploading, profileURL } = props;

    return (
      <div className="p-fileupload-row">
        <div>{file.name}</div>
        {uploading && file.status !== "uploaded" && (
          <ProgressBar mode="indeterminate" style={{ width: "100%" }} />
        )}
        {!uploading && file.status === "uploaded" && (
          <span className="p-field p-fileupload-filename">{file.name}</span>
        )}
        {!uploading && file.status === "uploaded" && (
          <span className="p-field p-fileupload-filename">
            Upload successful!
          </span>
        )}
        {!uploading && file.status === "uploaded" && profileURL && (
          <img src={profileURL} alt={file.name} />
        )}
        {!uploading && file.status === "error" && (
          <span className="p-field p-fileupload-filename">
            Upload failed :(
          </span>
        )}
      </div>
    );
  };

  const handleUpload = async (event, file) => {
    const formData = new FormData();
    formData.append("file", event.files[0]);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const response = await axios.post(cloudinaryUrl, formData);
      setProfileURL(response.data.secure_url);
      console.log(response.data.secure_url);

      formData.file.status = "uploaded";
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        {/* THIS IS WHERE YOU LEFT OFF */}
        <label
          htmlFor="personalPhoto"
          className="block text-900 font-medium mb-2"
        >
          Upload a picture{" "}
        </label>
        <FileUploader fileUrl={fileURL} setFileUrl={setFileURL} />
        {/* <FileUpload
                    name='personalPhoto'
                    url={`api/upload/`}
                    accept='image/*'
                    maxFileSize={1000000}
                    itemTemplate={itemTemplate}
                    emptyTemplate={<p className='m-0'>Drag and drop a picture of yourself here.</p>}
                    customUpload={true}
                    uploadHandler={handleUpload}
                    onUpload={(e) => console.log(e)}
                /> */}
        {/* {getFormErrorMessage('bio')} */}
      </div>

      <div className="">
        <label htmlFor="" className="block text-900 font-medium mb-1">
          Upload a government-issued ID
        </label>
        <p htmlFor="" className="block text-500 font-small mb-2">
          Provide proof of identity
        </p>
        <FileUpload
          name="personalPhoto"
          url={`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`}
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">Drag and drop an image of your id here.</p>
          }
          customUpload={true}
          uploadHandler={handleUpload}
        />
        {/* {getFormErrorMessage('bio')} */}
      </div>

      <div className="flex flex-wrap justify-content-between gap-2 mt-4">
        <Button
          label="Back"
          className=""
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={handlePreviousStep}
        />
        <Button
          label="Confirm"
          className=""
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={props.formik.handleSubmit}
        />
      </div>
    </div>
  );
};

//
const setupSteps = [
  HouseholdInformationStep,
  PaymentStep,
  AdditionalStep,
  VerificationStep,
];

export default setupSteps;
