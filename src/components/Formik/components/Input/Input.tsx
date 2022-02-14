import React, { ComponentPropsWithoutRef, forwardRef, Ref } from 'react';
import { useField } from 'formik';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 8px;
  position: relative;
`;

const Label = styled.label`
  font-size: 10px;
  font-weight: 500;
`;

type StyledWrapperInputProps = {
  variant?: 'default' | 'withText' | 'error' | 'success';
  withLeadingAdornment?: boolean;
  withTrailingAdornment?: boolean;
};

const StyledWrapperInput = styled.div<StyledWrapperInputProps>`
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  border-radius: 44px;
  background-color: none;
  max-height: 50px;

  ${({ variant }) => {
    switch (variant) {
      case 'default':
        return css`

          &:hover,
          &:focus-within {
            border: 1px solid var(--f-gray);
          }
        `;
      case 'withText':
        return css`
          border: 1px solid black;
        `;
      case 'error':
        return css`
          border: 1px solid var(--red);
        `;
      case 'success':
        return css`
          border: 1px solid var(--green);
        `;
      default:
        return '';
    }
  }}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px 24px;
  font-size: 14px;
  font-weight: 300;
  border: none;
  outline: none;
  border-radius: 44px;
  background: var(--whiter);

  &[type='number'] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

const StyledErrorText = styled.span`
  color: var(--red);
  font-size: 12px;
  line-height: 12px;
  font-weight: normal;
`;

type Props = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  className?: string;
  trailingAdornment?: JSX.Element;
  leadingAdornment?: JSX.Element;
  variant?: StyledWrapperInputProps['variant'];
};

function Input(
  { label, className, trailingAdornment, leadingAdornment, variant = 'default', ...props }: Props,
  ref: Ref<HTMLInputElement>
) {
  const [field, meta] = useField(props?.name || "field");

  const showError = meta.touched && meta.error;

  return (
    <StyledWrapper className={className}>
      {label && <Label>{label}</Label>}
      <StyledWrapperInput variant={!showError ? variant : 'error'}>
        {leadingAdornment}
        <StyledInput ref={ref} autoComplete={props.autoComplete || 'off'} {...field} {...props} />
        {trailingAdornment}
      </StyledWrapperInput>
      {meta.touched && meta.error && <StyledErrorText>{meta.error}</StyledErrorText>}
    </StyledWrapper>
  );
}

export default forwardRef<HTMLInputElement, Props>(Input);
