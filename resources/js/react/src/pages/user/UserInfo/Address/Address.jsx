import React from 'react'
import AddAddress from './AddAddress'
import { LocationOffOutlined } from '@mui/icons-material'
import { useAuth } from '../../../../services/AuthContex';
import { deleteAddress } from '../../../../services/AuthService';
import { toast } from 'react-toastify';
import UpdateAddress from './UpdateAddress';

function Address() {
    const { accessToken, currentUser, setCurrentUser } = useAuth();
    const AddressIcon = () => (
        <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px #0002',
            position: 'absolute',
            left: '50%',
            top: -76,
            transform: 'translateX(-50%)',
            zIndex: 2,
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e3bc61ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fffdfa" />
                <circle cx="12" cy="9" r="2.5" fill="#e3bc61ff" />
            </svg>
        </div>
    );
    const handleDeleteAddress = async (id) => {
        try {
            const { data } = await deleteAddress(id, accessToken);
            if (data.status === 'success') {
                toast.success("Adresiniz başarıyla kaldırıldı.");
                // Update the currentUser addresses state by removing the deleted address
                setCurrentUser(prev => ({
                    ...prev,
                    addresses: prev.addresses.filter(addr => addr.id !== id)
                }));
            }
        } catch (error) {
            if (error?.response?.data?.status === 'error') {
                toast.error(error.response.data.error || "Adresiniz kaldırılırken beklenmeyen bir hata oluştu.");
            }
            console.error("Adres silinirken bir hata oluştu:", error);
            return;
        }
        
    };
    return (
        <div className="myaccount-address">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 50 }}>
                <h5 className="small-title" style={{ margin: 0 }}>Adreslerim</h5>
                <AddAddress accessToken={accessToken} onCreateAddress={(newAddress) => {
                    // Update the currentUser addresses state with the new address
                    setCurrentUser(prevUser => ({
                        ...prevUser,
                        addresses: [...prevUser.addresses, newAddress]
                    }));
                }} />
            </div>

            <div class="row g-3">
                {currentUser?.addresses.map(addr => (
                    <div class="col-12 col-sm-6 col-md-4" key={addr.id}>
                        <div class="address-card">
                            <div class="address-icon position-relative mt-3"><AddressIcon /></div>
                            <h6 class="address-title text-center mb-3 mt-4">{addr.title}</h6>
                            <div class="address-body">
                                <p>{addr.name}</p>
                                <p>{addr.neighborhood}</p>
                                <p class="address-text">{addr.address}</p>
                                <p>{addr.district} / {addr.city}</p>
                                <p>{addr.phone}</p>
                            </div>

                            <div class="address-actions">
                                <button style={{ width: '45px' }} onClick={() => handleDeleteAddress(addr.id)} class="btn btn-outline-secondary btn-sm hiraola-btn hiraola-btn_sm">Sil</button>
                                <UpdateAddress initialValues={addr} />
                            </div>
                        </div>
                    </div>
                ))}
                {currentUser?.addresses.length === 0 && (
                    <div style={{ color: '#888', fontSize: 18, padding: 24, width: '100%', textAlign: 'center' }}>
                        <p><LocationOffOutlined style={{ fontSize: 80 }} /></p>
                        Henüz kayıtlı adresiniz bulunmamaktadır.
                    </div>

                )}
            </div>
        </div>
    )
}

export default Address
