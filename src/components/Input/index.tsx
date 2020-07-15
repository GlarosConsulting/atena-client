import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { useField } from '@unform/core';

interface SimpleInput {
  name: string;
  label?: string;
  className?: string;
}

type InputProps = JSX.IntrinsicElements['input'] & SimpleInput;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginLeft: 5,
    marginBottom: 3,
    fontWeight: 900,
  },
  input: {
    border: '1px solid #BBB',
    background: '#eee',
    padding: '8px 12px',
    borderRadius: 5,
    fontSize: '1rem',
    color: '#616161',
    '&::placeholder': {
      color: '#aaa',
    },
  },
});

const Input: React.FC<InputProps> = ({ name, label, className, ...rest }) => {
  const classes = useStyles();

  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      path: 'value',
      ref: inputRef.current,
    });
  }, [fieldName, registerField]);

  return (
    <div className={classNames([classes.root, className])}>
      {label && (
        <label className={classes.label} htmlFor={fieldName}>
          {label}
        </label>
      )}

      <input
        className={classes.input}
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <span>{error}</span>}
    </div>
  );
};

export default Input;
