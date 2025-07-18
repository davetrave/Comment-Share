import React from "react";
import { Input, FormItem, Select } from "components/ui";
import { Field } from "formik";
import { useSelector } from "react-redux";

const gender = [
  {
    label: "Male",
    value: "M"
  },
  { label: "Female", value: "F" }
];

const PersonalInfoForm = props => {
  const { touched, errors } = props;

  const faculties = useSelector(state => state.meta.faculties);

  const facultyOptions = faculties.map(faculty => ({
    value: faculty.name,
    label: faculty.name
  }));

  const genderOptions = gender.map(gender => ({
    value: gender.value,
    label: gender.label
  }));

  return (
    <>
      <FormItem
        label="Username"
        invalid={errors.username && touched.username}
        errorMessage={errors.username}
      >
        <Field
          type="text"
          autoComplete="off"
          name="username"
          placeholder="Username"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="First Name"
        invalid={errors.first_name && touched.first_name}
        errorMessage={errors.first_name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="first_name"
          placeholder="First Name"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Middle Name"
        invalid={errors.middle_name && touched.middle_name}
        errorMessage={errors.middle_name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="middle_name"
          placeholder="Middle Name"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Last Name"
        invalid={errors.last_name && touched.last_name}
        errorMessage={errors.last_name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="last_name"
          placeholder="Last Name"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Gender"
        invalid={errors.gender && touched.gender}
        errorMessage={errors.gender}
      >
        <Field name="gender">
          {({ field, form }) => (
            <Select
              options={genderOptions}
              placeholder="Select Gender"
              value={genderOptions.find(option => option.value === field.value)}
              onChange={option => {
                form.setFieldValue("gender", option.value);
              }}
            />
          )}
        </Field>
      </FormItem>
      <FormItem
        label="Faculty"
        invalid={errors.faculty && touched.faculty}
        errorMessage={errors.faculty}
      >
        <Field name="faculty">
          {({ field, form }) => (
            <Select
              options={facultyOptions}
              placeholder="Select Faculty"
              value={facultyOptions.find(
                option => option.value === field.value
              )}
              onChange={option => {
                form.setFieldValue("faculty", option.value);
              }}
            />
          )}
        </Field>
      </FormItem>
    </>
  );
};

export default PersonalInfoForm;
