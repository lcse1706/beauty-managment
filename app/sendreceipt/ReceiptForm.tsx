'use client';

import { Input, Select, Button, Loader } from '../../components/ui';
import { useDataContext } from '../../context/DataContext';
import { usePopupContext } from '../../context/PopupContext';
import { fetchReceipts, sendReceipt } from '../../services/receipts';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { sortReceipts } from '../../components/utils/sortReceipts';
import { useRouter } from 'next/navigation';
import styles from './ReceiptForm.module.css';

import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';

interface Receipt {
  receipt_id: string;
  name: string;
  email: string;
  treatment: string;
  price: string;
}

export const ReceiptForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { receipts, setReceipts, setLoading, loading } = useDataContext();
  const { setShowPopup, setMessage } = usePopupContext();

  //Moved from page.tsx to hide useEffect in client component

  const { isLogged } = useAuthContext();

  useEffect(() => {
    if (!isLogged) {
      router.push('/');
    }
  }, []);

  /////////////////////////////////////////////////////////////

  const clearInputs = () => {
    reset({
      name: '',
      email: '',
      treatment: '',
      price: '',
    });
  };

  const inputValidator = (): boolean => {
    if (Object.keys(errors).length > 0) {
      setMessage('Please fill all required fields');
      return true;
    }
    return false;
  };

  // const submitHandler: FormEventHandler<HTMLFormElement> = (event: React.FormEvent) => {
  const submitHandler: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setMessage('');

    if (inputValidator()) {
      setShowPopup(true);
      return;
    }

    let receipt: Receipt;

    if (receipts.length !== 0) {
      const sortedReceipts = sortReceipts(receipts);
      let getLastNumber = sortedReceipts[sortedReceipts.length - 1].fields.receipt_id.split('/')[0];
      const getMonthNumber = sortedReceipts[sortedReceipts.length - 1].fields.receipt_id.split('/')[1];

      if (+getMonthNumber !== new Date().getMonth() + 1) {
        getLastNumber = '0';
      }

      receipt = {
        receipt_id: +getLastNumber + 1 + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
        name: data.name,
        email: data.email,
        treatment: data.treatment,
        price: data.price,
      };
    } else {
      receipt = {
        receipt_id: '1/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(),
        name: data.name,
        email: data.email,
        treatment: data.treatment,
        price: data.price,
      };
    }

    const sendData = async () => {
      try {
        setLoading(true);
        await sendReceipt(receipt);
        setMessage('Receipt successfully added !');
        const data = await fetchReceipts();
        setReceipts(data);
        console.log('Receipt Lists updated.');
      } catch (error) {
        console.error(error);
        setMessage('Something went wrong !');
      } finally {
        setLoading(false);
        setShowPopup(true);
      }
    };

    sendData();

    //Set data to PDF Generator and open new tab with generated PDF
    localStorage.setItem('pdfData', JSON.stringify(receipt));
    // window.open('/pdf', '_blank');
    // window.open('/print', '_blank');
    router.push('/print');

    // router.push({
    //   pathname: '/print',
    //   query: { dataKey: receipt },
    // });

    // Reset inputs
    clearInputs();
  };

  return (
    <div className={styles.receiptFormWrapper}>
      <form className={styles.receiptForm} onSubmit={handleSubmit(submitHandler)}>
        <Input label="Client Name:" type="text" register={register('name', { required: true, maxLength: 80 })} />
        {errors.name && <span className={styles.errorMessage}>Please enter a valid name.</span>}
        <Input
          label="Client Email:"
          type="email"
          register={register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <span className={styles.errorMessage}>Please enter a valid email address.</span>}
        <Select
          label="Treatment:"
          options={['lashes', 'brows', 'nails']}
          register={register('treatment', { required: true })}
        />
        {errors.treatment && <span className={styles.errorMessage}>Please select a treatment.</span>}
        <Input label="Price:" type="number" register={register('price', { required: true, maxLength: 5 })} />
        {errors.price && <span className={styles.errorMessage}>Please enter a valid price.</span>}
        {loading ? <Loader /> : <Button label="Send" type="submit" />}
      </form>
    </div>
  );
};
