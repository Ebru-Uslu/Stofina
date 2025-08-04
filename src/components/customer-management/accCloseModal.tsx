import { Account } from '@/types/account';
import { Customer } from '@/types/customer';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, FormControlLabel, Checkbox, Grid, Box, Typography, Divider, Alert } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import React from 'react'

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    customer: Customer
    account: Account
}

const AccCloseModal = ({ open, onClose, onSubmit, customer, account }: Props) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <Typography variant="h6" fontWeight="bold">Hesap Kapatma Onayı</Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Aşağıdaki bilgileri doğrulayarak hesap kapatma işlemini onaylayın.
                </Typography>
                <Grid container spacing={2} >
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            size="small"
                            label="Müşteri Adı"
                            fullWidth
                            value={customer.tradeName || `${customer.firstName} ${customer.lastName}`}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            size="small"
                            label="Müşteri Numarası"
                            fullWidth
                            value={customer.id}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            size="small"
                            label="Hesap Numarası"
                            fullWidth
                            value={account.accountNo}
                            disabled
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                <Alert
                    severity="warning"
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#fef3c7',
                        borderColor: '#f59e0b',
                        '& .MuiAlert-icon': {
                            color: '#f59e0b'
                        }
                    }}
                >
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#92400e' }}>
                        Uyarı:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#92400e' }}>
                        Bu hesapta portföy değeri <strong>{formatCurrency(account.portfolioValue || 0)}</strong> ve
                        nakit bakiye <strong>{formatCurrency(account.balance || 0)}</strong> bulunmaktadır.
                        Hesap kapatmadan önce bu bakiyelerin temizlenmesi SPK ve BİST düzenlemeleri gereği zorunludur.
                    </Typography>
                </Alert>

                <Box sx={{
                    bgcolor: '#f3f4f6',
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid #d1d5db',
                    mt: 2
                }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: '#374151' }}>
                        BİST/SPK/MKK Uyarısı:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Hesap kapatma işlemi sonrasında:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: 'disc' }}>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                            Müşterinin tüm açık pozisyonları kapatılmalıdır
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                            MKK nezdindeki menkul kıymetler transfer edilmelidir
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                            Hesap kapatma formu müşteri tarafından imzalanmalıdır
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary">
                            Yasal bekleme süresi (30 gün) uygulanmalıdır
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="error" align="center">
                    Bu işlem geri alınamaz.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" onClick={onClose} color="primary">
                    Vazgeç
                </Button>
                <Button variant="contained" onClick={onSubmit} color="error">
                    Hesabı Kapat
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default AccCloseModal