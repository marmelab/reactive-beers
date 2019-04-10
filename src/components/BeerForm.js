import React from 'react';
import { Form, Field } from 'react-final-form';
import { Vanilla } from 'indicative/builds/formatters';
import Validator from 'indicative/builds/validator';
import { required } from 'indicative/builds/validations';

import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTextArea,
  EuiButton,
  EuiFilePicker,
  EuiTextColor,
  EuiSpacer,
} from '@elastic/eui';

const validator = Validator({ required }, Vanilla);

const rules = {
  title: 'required',
  description: 'required',
};

const messages = {
  'title.required': 'Beer title is required',
  'description.required': 'Beer description is required',
};

const validate = async values =>
  validator
    .validate(values, rules, messages)
    .then(() => ({}))
    .catch(errors => {
      return errors.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {});
    });

const wrapEuiFieldRow = Component => ({ input, meta, ...rest }) => {
  const { name, onChange, value, onBlur } = input;
  const isInvalid =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <Component
      {...rest}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      isInvalid={isInvalid}
    />
  );
};

const FieldText = wrapEuiFieldRow(EuiFieldText);
const FieldTextArea = wrapEuiFieldRow(EuiTextArea);

export const BeerForm = ({ onSubmit, beer }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={beer}
    validate={validate}
    render={({
      handleSubmit,
      hasValidationErrors,
      pristine,
      submitErrors,
      submitting,
      form,
    }) => {
      const handleIllustration = async files => {
        if (files.length === 0) {
          form.change('_image', undefined);
          return;
        }

        const file = files[0];

        form.change('_image', {
          data: file,
          type: file.type,
        });
      };

      return (
        <form onSubmit={e => handleSubmit(e).then(() => {} /*form.reset*/)}>
          <EuiForm>
            <EuiFormRow label="Beer Name*">
              <Field name="title" component={FieldText} />
            </EuiFormRow>
            <EuiFormRow label="Beer Description*">
              <Field
                name="description"
                component={FieldTextArea}
                rows={2}
                placeholder="Tape your description here..."
              />
            </EuiFormRow>
            <EuiFormRow label="Beer Illustration">
              <EuiFilePicker onChange={handleIllustration} />
            </EuiFormRow>
            <EuiButton
              type="submit"
              disabled={hasValidationErrors || submitting}
            >
              Submit
            </EuiButton>
            {submitErrors && submitErrors.global && (
              <p>{submitErrors.global}</p>
            )}
            <div>
              <EuiSpacer size="l" />
              <EuiTextColor color="subdued">* required fields</EuiTextColor>
            </div>
          </EuiForm>
        </form>
      );
    }}
  />
);

BeerForm.defaultValues = {
  beer: {},
};
