import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import * as Yup from 'yup';
import { Form, Formik, FormikProps } from 'formik';

import useToast from '@/hooks/use-toast';
import { getUserInfo } from '@/utils/utils';

import { CreateResultRequest } from '@/models/account';

import InputField from '@/component/input-field/input-field';
import DiamondButton from '@/component/common/button';
import Loading from '@/component/common/loading/loading';
import { CODE_SUCCESS } from '@/constant/common';
import { createResultApi, updateResultApi } from '@/services/staff';

const STEP = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOUR: 4,
};

const SERVICE_ID = {
  NORMAL: '1',
  ADVANCED: '2',
  PREMIUM: '3',
};

type Input = {
  step: number;
  name: string;
  label: string;
  placeholder?: string;
  isComboBox?: boolean;
  options?: DefaultOptionType[];
  serviceId?: string[];
};

const REVIEW_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'veryGood', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const LIST_INPUT: Input[] = [
  {
    step: STEP.FIRST,
    name: 'diamondId',
    label: 'Mã kim cương',
  },
  {
    step: STEP.FIRST,
    name: 'diamondOrigin',
    label: 'Nguồn gốc kim cương',
  },
  {
    step: STEP.SECOND,
    name: 'shape',
    label: 'Hình dạng',
    isComboBox: true,
    options: [
      { value: 'round', label: 'Round' },
      { value: 'princess', label: 'Princess' },
      { value: 'emerald', label: 'Emerald' },
      { value: 'asscher', label: 'Asscher' },
      { value: 'marquise', label: 'Marquise' },
      { value: 'oval', label: 'Oval' },
      { value: 'radiant', label: 'Radiant' },
      { value: 'pear', label: 'Pear' },
      { value: 'heart', label: 'Heart' },
      { value: 'cushion', label: 'Cushion' },
    ],
  },
  {
    step: STEP.SECOND,
    name: 'measurements',
    label: 'Kích thước',
    placeholder: 'Chiều dài x Chiều rộng x Chiều cao',
  },
  {
    step: STEP.SECOND,
    name: 'caratWeight',
    label: 'Trọng lượng carat',
    placeholder: 'Carat',
  },
  {
    step: STEP.SECOND,
    name: 'color',
    label: 'Màu sắc',
    isComboBox: true,
    options: [
      { value: 'D', label: 'D (Không màu hoàn toàn)' },
      { value: 'E', label: 'E (Gần như không màu, kém hơn D)' },
      { value: 'F', label: 'F (Gần như không màu, kém hơn E)' },
      { value: 'G', label: 'G (Gần như không màu, kém hơn F)' },
      { value: 'H', label: 'H (Có màu vàng rất nhẹ, kém hơn G)' },
      { value: 'I', label: 'I (Có màu vàng nhẹ, kém hơn H)' },
      { value: 'J', label: 'J (Có màu vàng nhẹ, kém hơn I)' },
      { value: 'K', label: 'K (Có màu vàng rõ hơn, kém hơn J)' },
      { value: 'L', label: 'L (Có màu vàng rõ hơn, kém hơn K)' },
      { value: 'M', label: 'M (Có màu vàng rõ hơn, kém hơn L)' },
      { value: 'N', label: 'N (Có màu vàng rõ hơn, kém hơn M)' },
      { value: 'O', label: 'O (Có màu vàng rõ hơn, kém hơn N)' },
      { value: 'P', label: 'P (Có màu vàng rõ hơn, kém hơn O)' },
      { value: 'Q', label: 'Q (Có màu vàng rõ hơn, kém hơn P)' },
      { value: 'R', label: 'R (Có màu vàng rõ hơn, kém hơn Q)' },
      { value: 'S', label: 'S (Có màu vàng rõ hơn, kém hơn R)' },
      { value: 'T', label: 'T (Có màu vàng rõ hơn, kém hơn S)' },
      { value: 'U', label: 'U (Có màu vàng rõ hơn, kém hơn T)' },
      { value: 'V', label: 'V (Có màu vàng rõ hơn, kém hơn U)' },
      { value: 'W', label: 'W (Có màu vàng rõ hơn, kém hơn V)' },
      { value: 'X', label: 'X (Có màu vàng rõ hơn, kém hơn W)' },
      { value: 'Y', label: 'Y (Có màu vàng rõ hơn, kém hơn X)' },
      { value: 'Z', label: 'Z (Có màu vàng rõ hơn, kém hơn Y)' },
    ],
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'clarity',
    label: 'Độ trong',
    isComboBox: true,
    options: [
      { value: 'FL', label: 'FL (Flawless)' },
      { value: 'IF', label: 'IF (Internally Flawless)' },
      { value: 'VVS1', label: 'VVS1 (Very Very Slightly Included 1)' },
      { value: 'VVS2', label: 'VVS2 (Very Very Slightly Included 2)' },
      { value: 'VS1', label: 'VS1 (Very Slightly Included 1)' },
      { value: 'VS2', label: 'VS2 (Very Slightly Included 2)' },
      { value: 'SI1', label: 'SI1 (Slightly Included 1)' },
      { value: 'SI2', label: 'SI2 (Slightly Included 2)' },
      { value: 'I1', label: 'I1 (Included 1)' },
      { value: 'I2', label: 'I2 (Included 2)' },
      { value: 'I3', label: 'I3 (Included 3)' },
    ],
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'cut',
    label: 'Chất lượng cắt',
    isComboBox: true,
    options: REVIEW_OPTIONS,
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'proportions',
    label: 'Tỷ lệ',
    isComboBox: true,
    options: REVIEW_OPTIONS,
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'polish',
    label: 'Đánh bóng',
    isComboBox: true,
    options: REVIEW_OPTIONS,
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'symmetry',
    label: 'Đối xứng',
    isComboBox: true,
    options: REVIEW_OPTIONS,
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.THIRD,
    name: 'fluorescence',
    label: 'Độ huỳnh quang',
    isComboBox: true,
    options: [
      { value: 'none', label: 'None' },
      { value: 'faint', label: 'Faint' },
      { value: 'medium', label: 'Medium' },
      { value: 'strong', label: 'Strong' },
      { value: 'veryStrong', label: 'Very Strong' },
    ],
    serviceId: [SERVICE_ID.ADVANCED, SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.FOUR,
    name: 'certification',
    label: 'Giấy chứng nhận',
    serviceId: [SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.FOUR,
    name: 'price',
    label: 'Giá tiền',
    placeholder: '$',
    serviceId: [SERVICE_ID.PREMIUM],
  },
  {
    step: STEP.FOUR,
    name: 'comments',
    label: 'Bình luận',
    serviceId: [SERVICE_ID.PREMIUM],
  },
];

const INIT_VALUES: CreateResultRequest = {
  caratWeight: '',
  diamondId: '',
  diamondOrigin: '',
  shape: '',
  measurements: '',
};

type Props = {
  isUpdate?: boolean;
  initValues?: CreateResultRequest;
  requestId?: number;
  isOpenCreateResultModal: boolean;
  setIsOpenCreateResultModal: Dispatch<SetStateAction<boolean>>;
  setLoadDataRequestAcceptedKey?: Dispatch<SetStateAction<number>>;
};

const CreateResultModal = ({
  isUpdate = false,
  initValues = INIT_VALUES,
  requestId,
  isOpenCreateResultModal,
  setIsOpenCreateResultModal,
  setLoadDataRequestAcceptedKey,
}: Props) => {
  const { notify } = useToast();

  const validate = Yup.object({
    diamondId: Yup.string().required('Bắt buộc'),
    diamondOrigin: Yup.string().required('Bắt buộc'),
    shape: Yup.string().required('Bắt buộc'),
    measurements: Yup.string().required('Bắt buộc'),
    caratWeight: Yup.string().required('Bắt buộc'),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState(STEP.FIRST);

  const formRef = useRef<FormikProps<CreateResultRequest>>(null);

  useEffect(() => {
    formRef.current?.resetForm();
    setStep(STEP.FIRST);
  }, [isOpenCreateResultModal]);

  const maxStep = useMemo(() => {
    const { serviceId } = getUserInfo();
    if (serviceId === SERVICE_ID.ADVANCED) {
      return STEP.THIRD;
    } else if (serviceId === SERVICE_ID.PREMIUM) {
      return STEP.FOUR;
    }
    return STEP.SECOND;
  }, [getUserInfo()]);

  const listInputAll = useMemo(() => {
    return LIST_INPUT.filter(
      (item) => !item.serviceId || item.serviceId.includes(getUserInfo().serviceId || '')
    );
  }, [getUserInfo()]);

  const listInput = useMemo(() => {
    return listInputAll.filter((item) => item.step === step);
  }, [step]);

  const title = useMemo(() => {
    if (step === STEP.SECOND) {
      return 'Hình dạng và kích thước';
    } else if (step === STEP.THIRD) {
      return 'Đánh giá chất lượng';
    } else if (step === STEP.FOUR) {
      return 'Các thuộc tính bổ sung cho gói cao cấp';
    }
    return 'Thông chung và định danh';
  }, [step]);

  const okText = useMemo(() => {
    if (step === maxStep) {
      return 'Gửi đơn';
    }
    return 'Tiếp theo';
  }, [step]);

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleNextOrSubmit = () => {
    if (step === maxStep) {
      formRef.current?.submitForm();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmitForm = async (values: CreateResultRequest) => {
    setIsLoading(true);
    setIsOpenCreateResultModal(false);
    const res = isUpdate
      ? await updateResultApi({ ...values })
      : await createResultApi({ ...values });

    if (res?.status === CODE_SUCCESS) {
      notify(
        'success',
        isUpdate
          ? 'Sửa kết quả thành công, vui lòng đợi Admin kiểm duyệt!'
          : 'Tạo đơn kết quả thành công, vui lòng đợi Admin kiểm duyệt!'
      );
      setLoadDataRequestAcceptedKey?.(Date.now());
    } else {
      notify('error', 'Error!');
    }
    setIsLoading(false);
  };

  const renderFooter = (OkBtn: React.FC, CancelBtn: React.FC, handleReset: () => void) => {
    return (
      <>
        <DiamondButton content='Xóa' type='text' htmlType='reset' onClick={handleReset} />
        <CancelBtn />
        <DiamondButton
          disabled={step === STEP.FIRST}
          content='Trở lại'
          type='dashed'
          onClick={handleBack}
        />
        <OkBtn />
      </>
    );
  };

  const renderInput = (
    values: CreateResultRequest,
    input: Input,
    setFieldValue: (field: string, value: string) => void
  ) => {
    const handleChange = (value: string) => {
      setFieldValue(input.name, value);
    };

    if (input.isComboBox) {
      return (
        <div className='d-flex flex-column fs-16' style={{ width: '100%' }}>
          <label className='mb-2 fs-16'>{input.label}</label>
          <Select
            size='large'
            defaultValue={values[`${input.name as keyof CreateResultRequest}`] as string}
            options={input.options}
            onChange={handleChange}
          />
        </div>
      );
    }
    return (
      <InputField
        label={input.label}
        name={input.name}
        type='text'
        placeholder={input.placeholder}
      />
    );
  };

  return (
    <>
      <Loading loading={isLoading} />
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{ ...initValues, requestId: requestId ?? initValues.requestId }}
        validationSchema={validate}
        onSubmit={handleSubmitForm}
      >
        {({ values, handleReset, setFieldValue }) => (
          <Form>
            <Modal
              open={isOpenCreateResultModal}
              title={title}
              okText={okText}
              cancelText='Hủy'
              onOk={handleNextOrSubmit}
              onCancel={() => setIsOpenCreateResultModal(false)}
              footer={(_, { OkBtn, CancelBtn }) => renderFooter(OkBtn, CancelBtn, handleReset)}
            >
              {listInput.map((item) => (
                <div key={item.name} className='form__field'>
                  {renderInput(values, item, setFieldValue)}
                </div>
              ))}
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateResultModal;
