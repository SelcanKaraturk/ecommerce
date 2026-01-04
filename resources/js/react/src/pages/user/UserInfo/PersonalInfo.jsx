import React, { useEffect, useState } from 'react'
import { updateProfile } from '../../../services/AuthService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../services/AuthContex';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NumericFormat } from 'react-number-format';
import useForm from '../../../services/hooks/useForm';
import ValidateError from '../../auth/ValidateError';
import Loading from '../../../layouts/GeneralComponents/Loading';

function PersonalInfo() {
    //const {form, setForm, handleChange, handleCancel, open, setOpen} = useForm();
    const { accessToken, currentUser, userLogout, setCurrentUser } = useAuth();
    const { form, setForm, handleChange } = useForm({
        userNumber: currentUser?.id || '', name: currentUser?.name || '', lastname: currentUser?.lastname || '',
        email: currentUser?.email || '', phone: currentUser?.phone || '', birthdate: currentUser?.birthdate || ''
    });
    const [errors, setErrors] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
    const [keepSubmit, setKeepSubmit] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setForm({
                userNumber: currentUser.id || '',
                name: currentUser.name || '',
                lastname: currentUser.lastname || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                birthdate: currentUser.birthdate || ''
            });
        }
    }, [currentUser]);


    const handleEmailVerifyContinue = async () => {
        setShowEmailVerifyModal(false);
        setKeepSubmit(true);
    };

    const handleEmailVerifyCancel = () => {
        setShowEmailVerifyModal(false);
        setForm(prev => ({ ...prev, email: currentUser?.email || '' }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.email !== currentUser?.email && !keepSubmit) {
            setShowEmailVerifyModal(true);
            return;
        }else{
            formSubmit();
        }
    }

    const formSubmit = async () =>{
         try {
                setProcessing(true);
                const { data } = await updateProfile(form, accessToken);
                console.log(data);
                if (data.status === 'success') {
                    toast.success(data.message || "Bilgileriniz güncellendi!");
                    setCurrentUser(data.user);
                    setErrors(null);
                    setKeepSubmit(false);
                }
                if (data.user.email_verified_at === null) {
                    userLogout();
                    toast.warning("Email adresinizi doğrulamanız gerekiyor. Lütfen email kutunuzu kontrol ediniz.");
                }
            } catch (err) {
                console.error("Kişisel Bilgi Formu Hatası:", err);
                if (err?.response?.status === 422) {
                    setErrors(err.response.data.errors);
                }
                if (err?.response?.data.status === 'error403') {
                    toast.error(err?.response?.data.error || "Bu işlemi yapmaya yetkiniz yoktur.");
                    userLogout();
                }
                // toast.error("Bir hata oluştu!");
            } finally { setProcessing(false); }
    }
    return (
        <>

            {/* ...existing form... */}
            {showEmailVerifyModal && (
                <div className='modal-overlay'>
                    <div className='modal-box'>
                        <p className='modal-text'>
                            Email adresinizi değiştirdiniz. Devam etmek için yeni email adresinizi doğrulamanız gerekiyor.<br />Devam etmek istiyor musunuz?
                        </p>
                        <div className='modal-button-row'>
                            <button onClick={handleEmailVerifyContinue} className='modal-continue-button' >Devam Et</button>
                            <button onClick={handleEmailVerifyCancel} className='modal-cancel-button'>Vazgeç</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="myaccount-details">
                <form onSubmit={handleSubmit}
                    className="hiraola-form"
                >
                    <div className="hiraola-form-inner">
                        <div className="single-input single-input-half">
                            <label htmlFor="account-details-firstname">
                                Ad*
                            </label>
                            <input
                                type="text"
                                id="account-details-firstname"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            {ValidateError(errors, 'name')}
                        </div>
                        <div className="single-input single-input-half">
                            <label htmlFor="account-details-lastname">
                                Soyad*
                            </label>
                            <input
                                type="text"
                                id="account-details-lastname"
                                name="lastname"
                                value={form.lastname}
                                onChange={e => setForm(prev => ({ ...prev, lastname: e.target.value }))}
                            />
                            {ValidateError(errors, 'lastname')}
                        </div>
                        <div className="single-input">
                            <label htmlFor="account-details-email">
                                Email*
                            </label>
                            <input
                                type="email"
                                id="account-details-email"
                                name="email"
                                value={form.email}
                                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                            {ValidateError(errors, 'email')}
                        </div>
                        <div className="single-input single-input-half">
                            <label htmlFor="account-details-phone">
                                Cep Telefonu
                            </label>

                            <NumericFormat
                                format="### ### ## ##"
                                mask="_"
                                value={form.phone}
                                onValueChange={values => setForm(prev => ({
                                    ...prev,
                                    phone: values.value
                                }))}
                                isAllowed={({ value }) => {
                                    // Sadece 5 ile başlayan ve en fazla 10 haneli (5xxxxxxxxx) numaraya izin ver
                                    if (!value) return true;
                                    if (value.length === 0) return true;
                                    if (value[0] !== '5') return false;
                                    if (value.length > 10) return false;
                                    return /^5\d{0,9}$/.test(value);
                                }}
                                type="tel"
                                id="account-details-phone"
                                name="phone"
                                placeholder="5xx xxx xxxx"
                                inputMode="numeric"
                            />
                            {ValidateError(errors, 'phone')}
                        </div>
                        <div className="single-input single-input-half">
                            <label htmlFor="account-details-birthdate">
                                Doğum Tarihi
                            </label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    value={form.birthdate ? new Date(form.birthdate) : null}
                                    onChange={newValue =>
                                        setForm(prev => ({ ...prev, birthdate: newValue }))
                                    }
                                    name="birthdate"
                                    maxDate={(() => {
                                        const today = new Date();
                                        const year = today.getFullYear() - 14;
                                        // 31 Aralık (Aralık = 11. ay)
                                        return new Date(year, 11, 31, 23, 59, 59, 999);
                                    })()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputProps: {
                                                sx: { height: 40, padding: '0 15px 0 15px' }
                                            },
                                            inputProps: {
                                                style: { height: 40, padding: '0 15px 0 15px' }
                                            }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                            {ValidateError(errors, 'birthdate')}
                        </div>
                        <div className="single-input">
                            {processing ? <Loading style="m-height mt-0" /> : <button
                                className="hiraola-btn hiraola-btn_dark"
                                type="submit"
                            >
                                <span>
                                    Kaydet
                                </span>
                            </button>
                            }

                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PersonalInfo
