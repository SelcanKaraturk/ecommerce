import React, { use, useEffect, useState } from 'react'
import useForm from '../../../services/hooks/useForm';
import { updatePassword } from '../../../services/AuthService';
import { useAuth } from '../../../services/AuthContex';
import { toast } from 'react-toastify';
import ValidateError from '../../auth/ValidateError';
import Loading from '../../../layouts/GeneralComponents/Loading';

function PasswordChange({ user }) {
  const { form, setForm, handleChange, resetForm } = useForm({ oldpassword: '', newpassword: '', newpassword_confirmation: '', user_id: user?.id || '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { accessToken, userLogout } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    setForm(prevForm => ({ ...prevForm, user_id: user?.id || '' }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const { data } = await updatePassword(form, accessToken);
      if (data.status === 'success') {
        toast.success(data.message || "Şifreniz başarıylaa güncellendi.");
        resetForm();
        setErrors(null);
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
      if (err?.response?.data.status === 'error') {
        toast.error(err?.response?.data.error || "Bir hata oluştu!");
      }
      // toast.error("Bir hata oluştu!");
    } finally { setProcessing(false); }
  }



  const EyeIcon = ({ open, onClick }) => (
    <span onClick={onClick} style={{ cursor: 'pointer', position: 'absolute', right: 12, top: '66%', transform: 'translateY(-50%)', zIndex: 2 }}>
      {open ? (
        // Zarif açık göz
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 11C3.5 6.5 7.5 3.5 11 3.5C14.5 3.5 18.5 6.5 21 11C18.5 15.5 14.5 18.5 11 18.5C7.5 18.5 3.5 15.5 1 11Z" />
          <circle cx="11" cy="11" r="3.2" />
        </svg>
      ) : (
        // Zarif kapalı göz
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 11C3.5 6.5 7.5 3.5 11 3.5C14.5 3.5 18.5 6.5 21 11C18.5 15.5 14.5 18.5 11 18.5C7.5 18.5 3.5 15.5 1 11Z" />
          <circle cx="11" cy="11" r="3.2" />
          <line x1="5" y1="17" x2="17" y2="5" stroke="#222" strokeWidth="1.5" />
        </svg>
      )}
    </span>
  );


  return (
    <>
      <form onSubmit={handleSubmit}
        className="hiraola-form"
      >
        {/* Erişilebilirlik için gizli username/email inputu */}
        <input
          type="hidden"
          name="username"
          autoComplete="username"
          value={user?.email || ''}
        />
        <div className="hiraola-form-inner">
          <div className="single-input">
            <label htmlFor="account-details-oldpass">
              Mevcut Şifre*
            </label>
            <div style={{ position: 'relative' }}>
              <input
                 type={showOldPassword ? 'text' : 'password'}
                 id="account-details-oldpass"
                 name="oldpassword"
                 style={{ paddingRight: 36 }}
                 onChange={handleChange}
                 value={form.oldpassword}
                 autoComplete="current-password"
              />
              <EyeIcon open={showOldPassword} onClick={() => setShowOldPassword(v => !v)} />
              {ValidateError(errors, 'oldpassword')}
            </div>
          </div>
          <div className="single-input">
            <label htmlFor="account-details-newpass">
              Yeni Şifre*
            </label>
            <div style={{ position: 'relative' }}>
              <input
                 type={showNewPassword ? 'text' : 'password'}
                 id="account-details-newpass"
                 name="newpassword"
                 style={{ paddingRight: 36 }}
                 onChange={handleChange}
                 value={form.newpassword}
                 autoComplete="new-password"
              />
              <EyeIcon open={showNewPassword} onClick={() => setShowNewPassword(v => !v)} />
              {ValidateError(errors, 'newpassword')}
            </div>
          </div>
          <div className="single-input">
            <label htmlFor="account-details-confpass">
              Yeni Şifreyi Tekrar*
            </label>
            <div style={{ position: 'relative' }}>
              <input
                 type={showConfirmPassword ? 'text' : 'password'}
                 id="account-details-confpass"
                 name="newpassword_confirmation"
                 style={{ paddingRight: 36 }}
                 onChange={handleChange}
                 value={form.newpassword_confirmation}
                 autoComplete="new-password"
              />
              <EyeIcon open={showConfirmPassword} onClick={() => setShowConfirmPassword(v => !v)} />
              {ValidateError(errors, 'newpassword_confirmation')}
            </div>
          </div>
          <div className="single-input">
            {processing ? <Loading /> :
              <button
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
    </>
  )
}


export default PasswordChange
