import { Input, InputProps } from 'antd';
import { ErrorMessage, useField } from 'formik';
import { ReactNode } from 'react';

type Props = {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  prefix?: ReactNode;
  validate?: (value: any) => undefined | string | Promise<any>;
} & InputProps;

const InputField = ({ label, size = 'large', prefix, ...props }: Props) => {
  const [field, meta] = useField(props);
  return (
    <div style={{ width: '100%' }}>
      <label htmlFor={field.name} className='mb-2 fs-16'>
        {label}
      </label>
      <Input
        {...field}
        {...props}
        status={meta.touched && meta.error ? 'error' : ''}
        autoComplete='off'
        name={field.name}
        type={props.type}
        placeholder={props.placeholder}
        size={size}
        prefix={prefix}
      />
      <ErrorMessage component='div' name={field.name} className='error' />
    </div>
  );
};

export default InputField;
