import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

type Props = {
  content: string;
  width?: string;
  onClick?: () => void;
} & ButtonProps;

const DiamondButton = ({ content, width, type = 'primary', onClick, ...props }: Props) => {
  return (
    <Button {...props} style={{ width }} type={type} onClick={onClick}>
      {content}
    </Button>
  );
};

export default DiamondButton;
