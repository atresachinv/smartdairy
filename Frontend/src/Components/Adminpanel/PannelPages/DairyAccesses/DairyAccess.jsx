import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createAccess } from "../../../../App/Features/Admin/SuperAdmin/accessSlice";

const DairyAccess = () => {
  const dispatch = useDispatch();
  const initialValues = {
    access_name: "",
    access_desc: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleCreateAccess = (e) => {
    e.preventDefault();

    if (!values.access_name.trim()) {
      toast.error("Please fill all required fields!");
      return;
    }

    dispatch(
      createAccess({
        access_name: values.access_name,
        access_desc: values.access_desc,
      })
    );
    setValues(initialValues);
    toast.success("New access created successfully...");
  };

  return (
    <div className="dairy-access-control-container w100 h1 d-flex-col a-center">
      <span>Create Access</span>
      <form
        onSubmit={handleCreateAccess}
        className="add-access-right-name-form-container w40 h40 d-flex-col p10 bg"
      >
        <div className="w100 my10 d-flex a-center sb">
          <label htmlFor="access_name">Enter Access Name</label>
          <input
            className="data px10"
            type="text"
            name="access_name"
            id="access_name"
            value={values.access_name}
            onChange={handleInputs}
          />
        </div>
        <div className="w100 my10 d-flex a-center sb">
          <label htmlFor="access_desc">Access Description</label>
          <input
            className="data px10"
            type="text"
            name="access_desc"
            id="access_desc"
            value={values.access_desc}
            onChange={handleInputs}
          />
        </div>
        <button type="submit" className="btn">
          Create
        </button>
      </form>
    </div>
  );
};

export default DairyAccess;
