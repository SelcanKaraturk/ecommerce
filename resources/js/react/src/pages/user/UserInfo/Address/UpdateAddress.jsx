import React, { useEffect, useState } from 'react'
import useForm from '../../../../services/hooks/useForm';
import ValidateError from '../../../auth/ValidateError';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import cityDistricts from '../cityDistricts.json';
import { updateAddressService } from '../../../../services/AuthService';
import Loading from '../../../../layouts/GeneralComponents/Loading';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../services/AuthContex';
function UpdateAddress({ initialValues }) {
    const { form, setForm, handleChange, handleCancel, open, setOpen } = useForm(initialValues || {}); 
    const [errors, setErrors] = useState(null);
    const [processing, setProcessing] = useState(false);
    const { accessToken, setCurrentUser } = useAuth();

    useEffect(() => {
        setForm(initialValues || {});
    }, [initialValues]);

    const handleSubmit = async () => {
        // Form gönderim işlemleri
        try {
            const {data} = await updateAddressService(form, accessToken);
            if (data.status === 'success') {
                toast.success("Adresiniz başarıyla güncellendi.");
                // Update the currentUser addresses state with the updated address
                setCurrentUser(prev => ({
                    ...prev,
                    addresses: prev.addresses.map(addr => addr.id === data.data.id ? data.data : addr)
                }));
                setOpen(false);
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                setErrors(error.response.data.errors || {});
                toast.error(error.response.data.error || "Adresiniz güncellenirken beklenmeyen bir hata oluştu.");
            }
        }finally {
            setProcessing(false);
        }

    }
  return (
    <>
        <button onClick={() => setOpen(!open)} class="hiraola-btn_sm d-flex align-items-center w-auto btn btn-sm">Düzenle</button>

        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth className='account-address-form'>
                        <DialogTitle sx={{color:'#cda557', fontSize: 20}}>Adres Düzenle</DialogTitle>
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
  )
}

export default UpdateAddress
