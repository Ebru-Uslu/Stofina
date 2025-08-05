import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, FormControlLabel, Checkbox, Grid, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Customer } from '@/types/customer';
import { customerType } from '@/constants/customerType';
import { SliceGlobalModal } from '@/slice/common/sliceGlobalModal';
import { setSelectedCustomer } from '@/slice/CustomerSlice';
import { useDispatchCustom } from '@/hooks/useDispatchCustom';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  customer: Customer
}

export default function NewCustomerModal({ open, onClose, onSubmit, customer }: Props) {
  const dispatch = useDispatchCustom();
  const [formData, setFormData] = useState({
    customerId: customer.id,
    initialBalance: '',
    openingDate: new Date(),
    isApproved: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleSubmit = () => {
    dispatch(SliceGlobalModal.actions.openModal({
      modalType: "info",
      message: `${customer?.firstName + " " + customer?.lastName} müşterisine ait hesap açma işlemini onaylıyor musunuz? `,
      multipleButtons: true,
      modalAction: () => {
        onSubmit(formData);
      }
    }))
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Hesap Ekle</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            size="small"
            label="Müşteri Numarası"
            fullWidth
            value={customer.id || ""}
            disabled
          />

          {customer.customerType === customerType.BIREYSEL ? <TextField
            size="small"
            label="Ad Soyad"
            fullWidth
            value={customer.firstName + " " + customer.lastName}
            disabled
          /> :
            (<>
              <TextField
                size="small"
                label="Ticaret Unvanı"
                fullWidth
                value={customer.tradeName}
                disabled
              />
              <TextField
                label="VKN"
                fullWidth
                value={customer.vkn}
                disabled
              />
            </>)}
          <TextField
            size="small"
            label="Hesap Açılış Tarihi"
            type="text"
            fullWidth
            value={formData.openingDate.toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
            disabled
          />
          <Box sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isApproved}
                  onChange={e => handleChange('isApproved', e.target.checked)}
                  sx={{ alignSelf: 'flex-start', mt: -0.5 }}
                />
              }
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      color: '#6c757d',
                      lineHeight: 1.4,
                      textAlign: 'justify'
                    }}
                  >
                    Müşterimiz, imzalamış olduğu <strong>Sermaye Piyasası Araçları Alım Satıma Aracılık Çerçeve Sözleşmesi</strong> kapsamında;
                    hisse senedi yatırım hesabı açma, kapatma ve güncelleme, hesaplara kullanıcı tanımlama/kaldırma,
                    müşteri bilgileri değişikliği, yasal yükümlülükler doğrultusunda yatırım hesabı bilgileri ve
                    bakiyelerinin görüntülenmesi, takas yükümlülükleri kapsamında kullanılmasına onay verilmesi,
                    aracı kurum nezdinde hesabın açılması, MKK nezdinde hesabın kaydedilmesi ve ilgili kurumlarla
                    bilgi paylaşımı, KVKK kapsamında kişisel verilerinin işlenmesi ve aktarılması hususlarında
                    ilgili sözleşmeyi imzalamış ve gerekli açık rızaları vermiştir.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#495057',
                      lineHeight: 1.4,
                      mt: 1,
                      textAlign: 'justify'
                    }}
                  >
                    İşbu onay, ilgili sözleşmenin müşteri tarafından imzalandığını ve yukarıda belirtilen
                    yetkilerin müşterinin bilgisi ve talebi doğrultusunda kullanıldığını teyit eder.
                  </Typography>
                </Box>
              }
              sx={{
                alignItems: 'flex-start',
                m: 0,
                width: '100%'
              }}
            />
          </Box>

        </Box>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.isApproved}
          variant="contained"
          color="success"
        >
          İleri
        </Button>
      </DialogActions>
    </Dialog>
  );
}