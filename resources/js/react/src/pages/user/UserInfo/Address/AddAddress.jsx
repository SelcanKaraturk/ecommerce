import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import cityDistricts from '../cityDistricts.json';
import useForm from '../../../../services/hooks/useForm';
import { NumericFormat } from 'react-number-format';
import { addAddress } from '../../../../services/AuthService';
import Loading from '../../../../layouts/GeneralComponents/Loading';
import ValidateError from '../../../auth/ValidateError';
import { toast } from 'react-toastify';

function AddAddress({ accessToken, onCreateAddress}) {
    const { form, setForm, handleChange, resetForm, open, setOpen, handleCancel } = useForm({
        name: '',
        lastname: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        address: '',
        title: ''
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        setProcessing(true);
        e.preventDefault();
        try {
            const { data } = await addAddress(form, accessToken);
            if (data.status === 'success') {
                toast.success(data.message || "Adres başarıyla eklendi.");
                onCreateAddress(data?.data); // Adres eklendiğinde yapılacak işlemler
                resetForm(); // Formu kapat
                setErrors(null);
                setOpen(false);
            }else{
                toast.warning("Beklenmeyen bir durum oluştu Lütfen daha sonra tekrar deneyiniz ya da destek ile iletişime geçiniz.");
            }
        } catch (error) {
            if(error?.response?.data?.status === 'error'){
                toast.error(error.response.data.error || "Adres eklenirken beklenmeyen bir hata oluştu.");
            }
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleOpen = () => setOpen(true);

    return (
        <>
            <button
                className="order-btn order-btn-primary"
                style={{ fontSize: 14, padding: '4px 16px', borderRadius: 6 }}
                onClick={handleOpen}
            >
                + Yeni Adres Ekle
            </button>
            <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth className='account-address-form'>
                <DialogTitle sx={{color:'#cda557', fontSize: 20}}>Adres Ekle</DialogTitle>
                <DialogContent>
                    <form>
                        <Box display="flex" gap={2} mb={1}>
                            <div className='w-100'> <TextField
                                size='small'
                                margin="dense"
                                label="Ad"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"

                            />
                                {ValidateError(errors, 'name')}
                            </div>
                            <div className='w-100'>
                                <TextField
                                    size='small'
                                    margin="dense"
                                    label="Soyad"
                                    name="lastname"
                                    value={form.lastname}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                />
                                {ValidateError(errors, 'lastname')}
                            </div>
                        </Box>
                        <NumericFormat
                            format="### ### ####"
                            mask="_"
                            value={form.phone}
                            onValueChange={values => setForm(prev => ({
                                ...prev,
                                phone: values.formattedValue
                            }))}
                            isAllowed={({ value }) => {
                                // Sadece 5 ile başlayan ve en fazla 10 haneli (5xxxxxxxxx) numaraya izin ver
                                if (!value) return true;
                                if (value.length === 0) return true;
                                if (value[0] !== '5') return false;
                                if (value.length > 10) return false;
                                return /^5\d{0,9}$/.test(value);
                            }}
                            customInput={TextField}
                            size='small'
                            margin="dense"
                            label="Telefon"
                            variant="outlined"
                            type="tel"
                            id="account-details-phone"
                            name="phone"
                            placeholder="5xx xxx xxxx"
                            inputMode="numeric"
                            fullWidth
                        />
                        {ValidateError(errors, 'phone')}
                        <Box display="flex" gap={2} mb={1}>
                            <div className='w-100'>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    options={Object.keys(cityDistricts)}
                                    value={form.city || null}
                                    onChange={(event, newValue) => {
                                        setForm(prev => ({ ...prev, city: newValue || '', district: '' }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="İl" margin="dense" variant="outlined" />
                                    )}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    getOptionLabel={(option) => option}
                                    noOptionsText="Sonuç yok"
                                />
                                {ValidateError(errors, 'city')}
                            </div>
                            <div className='w-100'>
                                <FormControl size="small" margin="dense" fullWidth>
                                    <InputLabel id="district-label">İlçe</InputLabel>
                                    <Select
                                        labelId="district-label"
                                        id="district"
                                        name="district"
                                        value={form.district}
                                        label="İlçe"
                                        onChange={handleChange}
                                        disabled={!form.city}
                                    >
                                        <MenuItem value="">Seçiniz</MenuItem>
                                        {form.city && cityDistricts[form.city]?.map(district => (
                                            <MenuItem key={district} value={district}>{district}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {ValidateError(errors, 'district')}
                            </div>
                        </Box>
                        <TextField
                            size='small'
                            margin="dense"
                            label="Mahalle"
                            name="neighborhood"
                            value={form.neighborhood}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        {ValidateError(errors, 'neighborhood')}
                        <TextField
                            size='small'
                            margin="dense"
                            label="Adres"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            multiline
                            minRows={2}
                            maxRows={3}
                        />
                        {ValidateError(errors, 'address')}
                        <TextField
                            size='small'
                            margin="dense"
                            label="Adres Başlığı (Ev, Ofis vb.)"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        {ValidateError(errors, 'title')}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} className='btn-ex'>İptal</Button>
                    {processing ? (<Loading style="m-height mt-0" />) : (
                        <Button onClick={handleSubmit} type="button" className='order-btn-primary' sx={{ backgroundColor: '#7c8289' }} variant="contained">Kaydet</Button>
                    )}

                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddAddress;