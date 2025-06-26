import React from "react";
import {
  Input,
  Avatar,
  Upload,
  Button,
  Notification,
  toast,
  FormContainer,
  Tooltip,
  Select // Make sure Select is imported
} from "components/ui";
import FormDescription from "../common/FormDescription";
import FormRow from "../common/FormRow";
import { Field, Form, Formik } from "formik";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineTrash
} from "react-icons/hi";
import * as Yup from "yup";
import { apiUpdateProfile } from "services/AccountServices";
import { useState } from "react";
import { setUser } from "store/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";

const gender = [
  {
    label: "Male",
    value: "M"
  },
  { label: "Female", value: "F" }
];

const genderOptions = gender.map(gender => ({
  value: gender.value,
  label: gender.label
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
  phone_number: Yup.string(),
  bio: Yup.string(),
  avatar: Yup.string().nullable(),
  gender: Yup.string().nullable() // Keep this here as it's necessary for Yup validation
});

function Profile({ data }) {
  const [preview, setPreview] = useState("");
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);

  const onSetFormFile = (form, field, file) => {
    setPreview(URL.createObjectURL(file[0]));
    form.setFieldValue(field.name, file[0]);
  };

  const onFormSubmit = async (values, setSubmitting) => {
    setSubmitting(true);

    try {
      let formData = new FormData();
      for (let key in values) {
        // Skip avatar if it's an unchanged string (meaning it's the URL from initial data)
        if (key === "avatar" && typeof values[key] === "string" && !preview) {
          continue;
        }
        // If avatar is being cleared (set to an empty string), or a new file is selected, append it
        if (
          key === "avatar" &&
          (values[key] === "" || values[key] instanceof File)
        ) {
          formData.append(key, values[key]);
        } else if (key !== "avatar") {
          // For all other fields
          formData.append(key, values[key]);
        }
      }

      const response = await apiUpdateProfile(formData);
      setSubmitting(false);
      if (response.data) {
        toast.push(
          <Notification
            title={"Profile updated successfully"}
            type="success"
          />,
          {
            placement: "top-center"
          }
        );
        dispatch(
          setUser({
            ...user,
            // Assuming your API returns the updated user object with avatar and gender
            avatar: response.data.avatar,
            gender: response.data.gender // Update gender in Redux store
          })
        );
      }
    } catch (error) {
      setSubmitting(false);
      if (error.response) {
        const messages = error.response.data;
        Object.keys(messages).forEach(key => {
          const error = messages[key];
          toast.push(
            <Notification title="Failure" type="danger">
              Failed to update profile: {Object.values(error).join(", ")}
            </Notification>,
            {
              placement: "top-center"
            }
          );
        });
      }
    }
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          onFormSubmit(values, setSubmitting);
        }, 1000);
      }}
    >
      {({ values, touched, errors, isSubmitting, resetForm }) => {
        const validatorProps = { touched, errors };
        return (
          <Form>
            <FormContainer>
              <FormDescription
                bio="General"
                desc="Basic info, like your email, phone number, avatar, and bio."
              />
              <FormRow name="email" label="Email" {...validatorProps}>
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                  prefix={<HiOutlineMail className="text-xl" />}
                />
              </FormRow>
              <FormRow
                name="phone_number"
                label="Phone Number"
                {...validatorProps}
              >
                <Field
                  type="tel"
                  autoComplete="off"
                  name="phone_number"
                  placeholder="Phone Number"
                  component={Input}
                  prefix="+251"
                />
              </FormRow>
              <FormRow name="avatar" label="Avatar" {...validatorProps}>
                <Field name="avatar">
                  {({ field, form }) => {
                    const avatarSrc = preview || field.value; // Use preview if available, otherwise field.value
                    const avatarProps = avatarSrc ? { src: avatarSrc } : {}; // If no avatar, just pass an empty object or a default icon

                    return (
                      <div className="flex items-center gap-4">
                        <Upload
                          className="cursor-pointer"
                          onChange={files => onSetFormFile(form, field, files)}
                          onFileRemove={files =>
                            onSetFormFile(form, field, files)
                          }
                          showList={false}
                          uploadLimit={1}
                        >
                          <Avatar
                            className="border-2 border-white dark:border-gray-800 shadow-lg"
                            size={60}
                            shape="circle"
                            icon={<HiOutlineUser />}
                            {...avatarProps}
                          />
                        </Upload>
                        {(field.value || preview) && ( // Show remove button if there's an avatar or a preview
                          <button
                            type="button"
                            onClick={() => {
                              form.setFieldValue("avatar", ""); // Set avatar to empty string to indicate removal
                              setPreview(null); // Clear the preview
                            }}
                          >
                            <Tooltip title="Remove avatar" placement="right">
                              <HiOutlineTrash className="text-red-500" />
                            </Tooltip>
                          </button>
                        )}
                      </div>
                    );
                  }}
                </Field>
              </FormRow>
              <FormRow
                name="bio"
                label="Bio"
                {...validatorProps}
                border={false}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="bio"
                  placeholder="Bio"
                  component={Input}
                  prefix={<HiOutlineDocumentText className="text-xl" />}
                />
              </FormRow>
              <FormRow
                label="Gender"
                invalid={errors.gender && touched.gender}
                {...validatorProps}
                border={false}
                errorMessage={errors.gender}
              >
                <Field name="gender">
                  {({ field, form }) => (
                    <Select
                      form={form} // Pass the form object
                      field={field} // Pass the field object
                      options={genderOptions}
                      placeholder="Select Gender"
                      value={genderOptions.find(
                        option => option.value === field.value
                      )}
                      onChange={option => {
                        form.setFieldValue("gender", option.value);
                      }}
                    />
                  )}
                </Field>
              </FormRow>
              <div className="mt-4 ltr:text-right">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button variant="solid" loading={isSubmitting} type="submit">
                  {isSubmitting ? "Updating" : "Update"}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Profile;
