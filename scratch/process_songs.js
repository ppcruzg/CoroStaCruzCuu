
const fs = require('fs');

const rawData = `
COMUNION - TU COMPASION ME SALVARA.M4A	https://drive.google.com/file/d/1J8a3JxRrMNZYh96zSyNUPM55M1POQbwC/view?usp=drivesdk	1J8a3JxRrMNZYh96zSyNUPM55M1POQbwC	audio/x-m4a
SALIDA - MARIA MIRAME Capo2.pdf	https://drive.google.com/file/d/1qyeVsHaIxRuvvERzEPCiKlz8TFMDilrB/view?usp=drivesdk	1qyeVsHaIxRuvvERzEPCiKlz8TFMDilrB	application/pdf
COMUNION  - TU COMPASIÓN ME SALVARÁ.pdf	https://drive.google.com/file/d/1z5d2xpnK4aSO5mjA5OIn9T9PAQzH1Bic/view?usp=drivesdk	1z5d2xpnK4aSO5mjA5OIn9T9PAQzH1Bic	application/pdf
COMUNION  - TU ROSTRO EN EL PAN Capo 1.pdf	https://drive.google.com/file/d/1sGA02vtCESPqG8hBvc6-5fAqJjijb3qF/view?usp=drivesdk	1sGA02vtCESPqG8hBvc6-5fAqJjijb3qF	application/pdf
DIGNO DE ALABAR.pdf	https://drive.google.com/file/d/1lxoBTSznuI5dU-leMf4XBWmXFEoYt0W-/view?usp=drivesdk	1lxoBTSznuI5dU-leMf4XBWmXFEoYt0W-	application/pdf
Copy of COMUNION - TÚ EN MÍ YO EN TI.pdf	https://drive.google.com/file/d/1O3braLcz0HmfHtrQnPvcFNRgpjqpY4fb/view?usp=drivesdk	1O3braLcz0HmfHtrQnPvcFNRgpjqpY4fb	application/pdf
COMUNION - TÚ EN MÍ YO EN TI.pdf	https://drive.google.com/file/d/1MCsyTb2cjvK6sKovoEmWldMkKSCl_QZg/view?usp=drivesdk	1MCsyTb2cjvK6sKovoEmWldMkKSCl_QZg	application/pdf
COMUNION - TÚ EN MÍ, YO EN TI.pdf	https://drive.google.com/file/d/1kOpCXqdEUpS2aJpynlXJRIRog9MMC_A0/view?usp=drivesdk	1kOpCXqdEUpS2aJpynlXJRIRog9MMC_A0	application/pdf
CORDERO DE DIOS (A).pdf	https://drive.google.com/file/d/17x4jYDbKdcmFxVtlG-eLWDzI6UNC411u/view?usp=drivesdk	17x4jYDbKdcmFxVtlG-eLWDzI6UNC411u	application/pdf
SANTO(Em).pdf	https://drive.google.com/file/d/1FmRzuXux-nuxs2i66YozbU-w5pkmyAE3/view?usp=drivesdk	1FmRzuXux-nuxs2i66YozbU-w5pkmyAE3	application/pdf
GLORIA RAPIDITO .pdf	https://drive.google.com/file/d/1qq_nnePamiJi-DCLgclnQq9zvse0kCQ7/view?usp=drivesdk	1qq_nnePamiJi-DCLgclnQq9zvse0kCQ7	application/pdf
ENTRADA - CON ALEGRIA EN EL CORAZON.pdf	https://drive.google.com/file/d/1S0ba40ZuWZSryPENBuFVG55dSeVTLMV5/view?usp=drivesdk	1S0ba40ZuWZSryPENBuFVG55dSeVTLMV5	application/pdf
SANTO EM.MP4	https://drive.google.com/file/d/15rRqZ-VwE02QwxWFPMW-FXJLnSBC_yA9/view?usp=drivesdk	15rRqZ-VwE02QwxWFPMW-FXJLnSBC_yA9	video/mp4
CORDERO DE DIOS A.mp4	https://drive.google.com/file/d/1yPWiqzaqFrSnnrb0ENp00NzbvzJDXdT6/view?usp=drivesdk	1yPWiqzaqFrSnnrb0ENp00NzbvzJDXdT6	video/mp4
SECUENCIA DE PENTECOSTÉS.pdf	https://drive.google.com/file/d/16B8ls82eJzIwWbJbuxjO6ejjOHQg6xXb/view?usp=drivesdk	16B8ls82eJzIwWbJbuxjO6ejjOHQg6xXb	application/pdf
SALIDA - ESPERANDO CON MARIA.pdf	https://drive.google.com/file/d/1jEURPJvU1cz8_IQJ95-NNRpnm5LTxg2N/view?usp=drivesdk	1jEURPJvU1cz8_IQJ95-NNRpnm5LTxg2N	application/pdf
COMUNION - VEN ESPIRITU.m4a	https://drive.google.com/file/d/1Jf6LOmiOxWXzc1WpEHWxBEKV92cXS8aX/view?usp=drivesdk	1Jf6LOmiOxWXzc1WpEHWxBEKV92cXS8aX	audio/x-m4a
SECUENCIA DE PENTECOSTES.m4a	https://drive.google.com/file/d/1Jub4iCQRLoZ2bY-kTd8PHMBbEypoiGOy/view?usp=drivesdk	1Jub4iCQRLoZ2bY-kTd8PHMBbEypoiGOy	audio/x-m4a
SALIDA  -  GRANITO DE MOSTAZA.pdf	https://drive.google.com/file/d/1WNq_rC3jvk9__BBy1EPcoDzYCB2t50eZ/view?usp=drivesdk	1WNq_rC3jvk9__BBy1EPcoDzYCB2t50eZ	application/pdf
SALIDA - GRANITO DE MOSTAZA.m4a	https://drive.google.com/file/d/1CcactL3SEp9aEWYn_WCmB0v_AJwltU_M/view?usp=drivesdk	1CcactL3SEp9aEWYn_WCmB0v_AJwltU_M	audio/x-m4a
OFERTORIO - CONVIERTELOS.m4a	https://drive.google.com/file/d/1BHYtYJxeWV7SuOCpKKB3VWmDGW4Kg-eB/view?usp=drivesdk	1BHYtYJxeWV7SuOCpKKB3VWmDGW4Kg-eB	audio/x-m4a
CRISTO SUBE A LAS ALTURAS.m4a	https://drive.google.com/file/d/1PqULIs4OhOozZ48zh9QX3sD1aAGTvW0v/view?usp=drivesdk	1PqULIs4OhOozZ48zh9QX3sD1aAGTvW0v	audio/x-m4a
OFERTORIO -  CONVIERTELOS.pdf	https://drive.google.com/file/d/1EkJKHlVdlpR6vefcKFLCjP4N2BNpzHZR/view?usp=drivesdk	1EkJKHlVdlpR6vefcKFLCjP4N2BNpzHZR	application/pdf
COMUNION  - AQUI ESTA EL SEÑOR.m4a	https://drive.google.com/file/d/1yHYApWXtmcTOpynKYl1qMSdtUqUdWKc1/view?usp=drivesdk	1yHYApWXtmcTOpynKYl1qMSdtUqUdWKc1	audio/x-m4a
ALEGRE LA MAÑANA.m4a	https://drive.google.com/file/d/1IcqkRweLGdi8HJmy8srnLMTP0NbFgTLw/view?usp=drivesdk	1IcqkRweLGdi8HJmy8srnLMTP0NbFgTLw	audio/x-m4a
ENTRADA - ALEGRE LA MAÑANA.pdf	https://drive.google.com/file/d/1Yzr83mmQ4MDg7LGTDElIOJ_Pps6ug90h/view?usp=drivesdk	1Yzr83mmQ4MDg7LGTDElIOJ_Pps6ug90h	application/pdf
CORDERO DE DIOS 3 voces.pdf	https://drive.google.com/file/d/1YJeK7z69gbAsTUNhL4s3WEmw8wgqxVqq/view?usp=drivesdk	1YJeK7z69gbAsTUNhL4s3WEmw8wgqxVqq	application/pdf
COMUNION - AQUI ESTA EL SEÑOR.pdf	https://drive.google.com/file/d/1VBcA32ggRXsp5_qTvQQr8_9LFJb0Cstw/view?usp=drivesdk	1VBcA32ggRXsp5_qTvQQr8_9LFJb0Cstw	application/pdf
ENTRADA - RESUCITO ALELUYA - .m4a	https://drive.google.com/file/d/1V2Wnm_4qorIaB3YSVv3itGJZ3Nj9GZKh/view?usp=drivesdk	1V2Wnm_4qorIaB3YSVv3itGJZ3Nj9GZKh	audio/x-m4a
SALIDA - LA COSECHA.m4a	https://drive.google.com/file/d/1cghviRsCB8XDoA47hXm9WCtacXl78aCW/view?usp=drivesdk	1cghviRsCB8XDoA47hXm9WCtacXl78aCW	audio/x-m4a
SALIDA - LA COSECHA.pdf	https://drive.google.com/file/d/1RMDgLPj0Omb2dWzClo7D8r6o09P4JobW/view?usp=drivesdk	1RMDgLPj0Omb2dWzClo7D8r6o09P4JobW	application/pdf
ENTRADA - RESUCITO ALELUYA.pdf	https://drive.google.com/file/d/19gEMiCVWf0mVWvEkp3Ru5ng_mGYpQbZY/view?usp=drivesdk	19gEMiCVWf0mVWvEkp3Ru5ng_mGYpQbZY	application/pdf
SALIDA  - AVE MARIA.pdf	https://drive.google.com/file/d/1714zT53IWG8018ZBZrQF_T_mPGdaR6dK/view?usp=drivesdk	1714zT53IWG8018ZBZrQF_T_mPGdaR6dK	application/pdf
ENTRADA  - EL SEÑOR ES MI PASTOR.pdf	https://drive.google.com/file/d/1f-kRE6CpYPB3FdwcESwO-JJG-pULeYmd/view?usp=drivesdk	1f-kRE6CpYPB3FdwcESwO-JJG-pULeYmd	application/pdf
CUMUNION  - EL SEÑOR ES MI PASTOR.M4A	https://drive.google.com/file/d/1-Dv8JQxE8z-YI0M_kAiHNcGO_7UKXSX7/view?usp=drivesdk	1-Dv8JQxE8z-YI0M_kAiHNcGO_7UKXSX7	audio/x-m4a
PIEDAD - MOVIDITO.M4A	https://drive.google.com/file/d/1L124AY3Kur2wAhcVWpgjxbKj_cX_ha5a/view?usp=drivesdk	1L124AY3Kur2wAhcVWpgjxbKj_cX_ha5a	audio/x-m4a
SALIDA - AVE MARIA.M4A	https://drive.google.com/file/d/1AC-wBgeETnrK2Ca2OacVMX--UzPOoXWr/view?usp=drivesdk	1AC-wBgeETnrK2Ca2OacVMX--UzPOoXWr	audio/x-m4a
ENTRADA  - EL SEÑOR ES MI PASTOR.M4A	https://drive.google.com/file/d/1DAa5tVe69_2eK2QoEOptX58NFg5yRQyb/view?usp=drivesdk	1DAa5tVe69_2eK2QoEOptX58NFg5yRQyb	audio/x-m4a
PIEDAD 3 MOVIDITO.pdf	https://drive.google.com/file/d/1y4VjxF4MBN9C4kFs62ZUW1ZM3Uu6L04E/view?usp=drivesdk	1y4VjxF4MBN9C4kFs62ZUW1ZM3Uu6L04E	application/pdf
COMUNION - TOCASTE MIS MANOS.pdf	https://drive.google.com/file/d/1RtTq-9wHnt0a5b76dbMeuskcL4x2Bi6j/view?usp=drivesdk	1RtTq-9wHnt0a5b76dbMeuskcL4x2Bi6j	application/pdf
COMUNION  - TOCASTE MIS MANOS.mp4	https://drive.google.com/file/d/1422C2hdBiEoh095S6ZucNTZWpU318mIb/view?usp=drivesdk	1422C2hdBiEoh095S6ZucNTZWpU318mIb	video/mp4
SANTO (Dm).pdf	https://drive.google.com/file/d/1Z1ddACdyWCiwdCM_ilbKs9zwEWoF-D0u/view?usp=drivesdk	1Z1ddACdyWCiwdCM_ilbKs9zwEWoF-D0u	application/pdf
OFERTORIO - SOBRE TU ALTAR.pdf	https://drive.google.com/file/d/15UyS2HqQdqc3UUP9ZTBzbw2g-ftteeC1/view?usp=drivesdk	15UyS2HqQdqc3UUP9ZTBzbw2g-ftteeC1	application/pdf
COMUNION - OH BUEN JESUS.pdf	https://drive.google.com/file/d/1wf2vnefXI6IVURnW58prhsvtF6tZt1w6/view?usp=drivesdk	1wf2vnefXI6IVURnW58prhsvtF6tZt1w6	application/pdf
ENTRADA - AL REDEDOR DE TU MESA.pdf	https://drive.google.com/file/d/16Nqz_WI0wfQBEOSxHfIgvpexLq5x631r/view?usp=drivesdk	16Nqz_WI0wfQBEOSxHfIgvpexLq5x631r	application/pdf
COMUNION  - AQUÍ ESTA EL SEÑOR.pdf	https://drive.google.com/file/d/118VC2Zmxf142PqFn0RXZ0nVu3UOyHta5/view?usp=drivesdk	118VC2Zmxf142PqFn0RXZ0nVu3UOyHta5	application/pdf
COMUNION - IN PERSONA CRISTI.pdf	https://drive.google.com/file/d/1e3MGYTpwA9RjdWiUOkmszgDw2_pze1jx/view?usp=drivesdk	1e3MGYTpwA9RjdWiUOkmszgDw2_pze1jx	application/pdf
ENTRADA - REUNIDOS EN EL NOMBRE DEL SEÑOR.pdf	https://drive.google.com/file/d/1GLsiz-uv_oudsqP1L-N878IE5qcxVJCe/view?usp=drivesdk	1GLsiz-uv_oudsqP1L-N878IE5qcxVJCe	application/pdf
SALIDA - JUNTO A TI MARIA.pdf	https://drive.google.com/file/d/1BCoGTI-zqsa6WAeJR3fGsLxL8My_3Ugj/view?usp=drivesdk	1BCoGTI-zqsa6WAeJR3fGsLxL8My_3Ugj	application/pdf
COMUNION  - PASE LO QUE PASE.pdf	https://drive.google.com/file/d/1WUcxM3-jaY6l1-dpuHJgiTXftLbCFNLR/view?usp=drivesdk	1WUcxM3-jaY6l1-dpuHJgiTXftLbCFNLR	application/pdf
ADORACION - ENTRA.pdf	https://drive.google.com/file/d/1bENGbWGCQ80DUF77n_KaCJJQ1M3VIEm6/view?usp=drivesdk	1bENGbWGCQ80DUF77n_KaCJJQ1M3VIEm6	application/pdf
ADORACION  - TU SEÑOR.pdf	https://drive.google.com/file/d/1GMymHkfer0f5NVYsG3Bpu9Ge48UTl5Gy/view?usp=drivesdk	1GMymHkfer0f5NVYsG3Bpu9Ge48UTl5Gy	application/pdf
ADORACION  - ENTRARE.pdf	https://drive.google.com/file/d/1m3i12RxlGFdtf-8FuMktEHA8QMnT6FCz/view?usp=drivesdk	1m3i12RxlGFdtf-8FuMktEHA8QMnT6FCz	application/pdf
ADORACION - DAME UN NUEVO CORAZON.pdf	https://drive.google.com/file/d/1hMMYJPPnGD2OBzmgWPmlvN-h58HsV2Jy/view?usp=drivesdk	1hMMYJPPnGD2OBzmgWPmlvN-h58HsV2Jy	application/pdf
ADORACION  - SOLO_DIOS.pdf	https://drive.google.com/file/d/1z9JTM13B1BZku488xPxKE4mkhu_xeEz-/view?usp=drivesdk	1z9JTM13B1BZku488xPxKE4mkhu_xeEz-	application/pdf
ENTREDA - CAMINARE.pdf	https://drive.google.com/file/d/1CDcvl9KOwUH7qLhvBDuel7kik6gtCYBo/view?usp=drivesdk	1CDcvl9KOwUH7qLhvBDuel7kik6gtCYBo	application/pdf
COMUNION - ESTAS AQUI.pdf	https://drive.google.com/file/d/1wxwExuIeGoRxV14PVjyq0wFLmxGQctbB/view?usp=drivesdk	1wxwExuIeGoRxV14PVjyq0wFLmxGQctbB	application/pdf
SALIDA - ACASO NO ESTOY YO AQUI.pdf	https://drive.google.com/file/d/1frOvCLp3FhA128r9e4pH6e8H2eYfp8qk/view?usp=drivesdk	1frOvCLp3FhA128r9e4pH6e8H2eYfp8qk	application/pdf
SALIDA - JESUS ESTA EN TI.pdf	https://drive.google.com/file/d/1t4QFhANIYSJHmbMtZL9VK3eTMxsGfm8H/view?usp=drivesdk	1t4QFhANIYSJHmbMtZL9VK3eTMxsGfm8H	application/pdf
COMUNION  - MI PRIMERA COMUNION.m4a	https://drive.google.com/file/d/1OsfzkTkgvmt5zhNxkmjIPDjZQDwbYwow/view?usp=drivesdk	1OsfzkTkgvmt5zhNxkmjIPDjZQDwbYwow	audio/x-m4a
SALIDA - ES JESUS.m4a	https://drive.google.com/file/d/1s-si5OZdmmVwX-qM68F3k3dfzM4VPPaf/view?usp=drivesdk	1s-si5OZdmmVwX-qM68F3k3dfzM4VPPaf	audio/x-m4a
COMUNION - MI PRIMERA COMUNION.pdf	https://drive.google.com/file/d/13TVm0sZNSRBU2SnR3Fov1sXt4NM7roBT/view?usp=drivesdk	13TVm0sZNSRBU2SnR3Fov1sXt4NM7roBT	application/pdf
CORDERO DE DIOS.pdf	https://drive.google.com/file/d/16m8xLSq0kFT5E7WBd8OdfvPqK9YB8dDj/view?usp=drivesdk	16m8xLSq0kFT5E7WBd8OdfvPqK9YB8dDj	application/pdf
SALMO - El señor es  02-06-24.pdf	https://drive.google.com/file/d/1d15pnvhrF9YlToTPmim9hKtvD87hckpB/view?usp=drivesdk	1d15pnvhrF9YlToTPmim9hKtvD87hckpB	application/pdf
SALIDA - VIVA CRISTO REY tono D.pdf	https://drive.google.com/file/d/11-GBQ08Lz65d0uJvux0IMOXFTLJ4Sa2K/view?usp=drivesdk	11-GBQ08Lz65d0uJvux0IMOXFTLJ4Sa2K	application/pdf
ENTRADA - VENIMOS HOY A TU ALTAR.pdf	https://drive.google.com/file/d/15WFyQG18GqjTLQeG3q85IaJn-eByJfeM/view?usp=drivesdk	15WFyQG18GqjTLQeG3q85IaJn-eByJfeM	application/pdf
SALMO - Dichoso el pueblo 26-05-24.pdf	https://drive.google.com/file/d/13Vplc-8LMnPvqiHbLcJEDfyQCeWhkZut/view?usp=drivesdk	13Vplc-8LMnPvqiHbLcJEDfyQCeWhkZut	application/pdf
SALMO - Que sea señor 25-05-24.pdf	https://drive.google.com/file/d/1Sa3TubwixiEpKnQ2YkZq8Ba0wMK-6Sy6/view?usp=drivesdk	1Sa3TubwixiEpKnQ2YkZq8Ba0wMK-6Sy6	application/pdf
SALMO - Dichoso el pueblo.m4a	https://drive.google.com/file/d/1jhHACgt5qH5JU33a3OEVAON1oHO9bHX1/view?usp=drivesdk	1jhHACgt5qH5JU33a3OEVAON1oHO9bHX1	audio/x-m4a
SALMO - que sea señor mi oración.m4a	https://drive.google.com/file/d/1k9I1M9IJCjU-lnbM7Nf0DIhzZV1JgIca/view?usp=drivesdk	1k9I1M9IJCjU-lnbM7Nf0DIhzZV1JgIca	audio/x-m4a
SALIDA - GOZO DE LA TRINIDAD.pdf	https://drive.google.com/file/d/1K8ArJhR7630lpNnuHTARgenC_ptOFrGk/view?usp=drivesdk	1K8ArJhR7630lpNnuHTARgenC_ptOFrGk	application/pdf
GLORIA MOVIDITO.pdf	https://drive.google.com/file/d/1vKfDpu_b6fGUeN0qmWI1sFb9khcNi3X2/view?usp=drivesdk	1vKfDpu_b6fGUeN0qmWI1sFb9khcNi3X2	application/pdf
SALIDA - SON_XV_AÑOS.pdf	https://drive.google.com/file/d/1KflHQ8Coh3CGCCPwMaubctKDTiVFmThp/view?usp=drivesdk	1KflHQ8Coh3CGCCPwMaubctKDTiVFmThp	application/pdf
ENTRADA - VAMOS AL ALTAR DE DIOS.pdf	https://drive.google.com/file/d/1XnhZKrjIgdQBMjLk10h_Zs4k_6YVb3W5/view?usp=drivesdk	1XnhZKrjIgdQBMjLk10h_Zs4k_6YVb3W5	application/pdf
COMUNIÓN -Dios mío.m4a	https://drive.google.com/file/d/1Hto6fuLGRfrpN78gH9hGt_QR5H6u-d7s/view?usp=drivesdk	1Hto6fuLGRfrpN78gH9hGt_QR5H6u-d7s	audio/x-m4a
ENTRADA - Gloria trinitario.m4a	https://drive.google.com/file/d/1T5LKJ5gjSTSRrK7TnVeS5Ly0uThj_Vfr/view?usp=drivesdk	1T5LKJ5gjSTSRrK7TnVeS5Ly0uThj_Vfr	audio/x-m4a
ENTRADA - GLORIA TRINITARIO.pdf	https://drive.google.com/file/d/1PaQc2GLTsXe9ZVKG0JJHHemdRCaEVPVj/view?usp=drivesdk	1PaQc2GLTsXe9ZVKG0JJHHemdRCaEVPVj	application/pdf
COMUNION - DIOS MIO.pdf	https://drive.google.com/file/d/14yQ2R4UpakIDqyMAsadtBwIV1zrZ9u1R/view?usp=drivesdk	14yQ2R4UpakIDqyMAsadtBwIV1zrZ9u1R	application/pdf
SALMO - ENVIA SEÑOR TU ESPIRITU - 19 MAYO 24.pdf	https://drive.google.com/file/d/1nqi2eFgSrWdsSaZi_ZgtBHZWJHEJ1gsr/view?usp=drivesdk	1nqi2eFgSrWdsSaZi_ZgtBHZWJHEJ1gsr	application/pdf
SALMO  - Envía señor tu espíritu.m4a	https://drive.google.com/file/d/1UezZ_dPW57OA4gGzOUDMmASVNAARhjcO/view?usp=drivesdk	1UezZ_dPW57OA4gGzOUDMmASVNAARhjcO	audio/x-m4a
Copy of VARIOS - Sec Pentecostés.m4a	https://drive.google.com/file/d/1UPcYxlHGamq4F1T9dX2yQWqoaW5y9gcF/view?usp=drivesdk	1UPcYxlHGamq4F1T9dX2yQWqoaW5y9gcF	audio/x-m4a
VARIOS - SECUENCIA DE PENTECOSTÉS.pdf	https://drive.google.com/file/d/1rbxFzhot-QNnkNY90b3EPIYD0-FOcJ9b/view?usp=drivesdk	1rbxFzhot-QNnkNY90b3EPIYD0-FOcJ9b	application/pdf
COMUNION - VEN ESPIRITU.pdf	https://drive.google.com/file/d/1oZt6VK4k7g6CnJolLYD-bZMOTa6gML4S/view?usp=drivesdk	1oZt6VK4k7g6CnJolLYD-bZMOTa6gML4S	application/pdf
ENTRADA - ESTAMOS AQUI.pdf	https://drive.google.com/file/d/1nSkufWPoEVLV0giQNp73EDIdgRhoLTdp/view?usp=drivesdk	1nSkufWPoEVLV0giQNp73EDIdgRhoLTdp	application/pdf
COMUNION  - Ven espíritu.m4a	https://drive.google.com/file/d/122Zc8S2ingziQ2U0oh9gvAiS7p6AL6EY/view?usp=drivesdk	122Zc8S2ingziQ2U0oh9gvAiS7p6AL6EY	audio/x-m4a
VARIOS - Sec Pentecostés.m4a	https://drive.google.com/file/d/14bID-y-rC3FG2xjjwRfwBKrt5ERNYksM/view?usp=drivesdk	14bID-y-rC3FG2xjjwRfwBKrt5ERNYksM	audio/x-m4a
COMUNION - YO SOY EL CAMINO FIRME.m4a	https://drive.google.com/file/d/1vHBd90BQ-j7FdhZe_rlgr0jH860bFqX6/view?usp=drivesdk	1vHBd90BQ-j7FdhZe_rlgr0jH860bFqX6	audio/x-m4a
COMUNION - YO SOY EL CAMINO FIRME.pdf	https://drive.google.com/file/d/1oPRHA5AkQ6GEyxlu0BzCI8pMMvKDztiV/view?usp=drivesdk	1oPRHA5AkQ6GEyxlu0BzCI8pMMvKDztiV	application/pdf
SALIDA - MADRE ERES TERNURA.pdf	https://drive.google.com/file/d/1Wo8PfL3Qqe960-kjmcwzsHf7BUBR9z6A/view?usp=drivesdk	1Wo8PfL3Qqe960-kjmcwzsHf7BUBR9z6A	application/pdf
COMUNION - CADA VEZ QUE TE RECIBO.pdf	https://drive.google.com/file/d/10VEJZsZUaudWXIgMM9ch1PvvAuhhWQs3/view?usp=drivesdk	10VEJZsZUaudWXIgMM9ch1PvvAuhhWQs3	application/pdf
ENTRADA - CRISTO SUBE A LAS ALTURAS.pdf	https://drive.google.com/file/d/1pQre7p529PwfoKHIKqqWckc33bI3xG88/view?usp=drivesdk	1pQre7p529PwfoKHIKqqWckc33bI3xG88	application/pdf
SALMO - 28 ABRIL 24.pdf	https://drive.google.com/file/d/1bNZXJFGJXqAl1NVsdlaFL9NmPnbkwZjE/view?usp=drivesdk	1bNZXJFGJXqAl1NVsdlaFL9NmPnbkwZjE	application/pdf
SALMO - Bendito sea el señor , aleluya.m4a	https://drive.google.com/file/d/1IeWwBCwt0ajRpugjBHEb_us9MLNu1xc0/view?usp=drivesdk	1IeWwBCwt0ajRpugjBHEb_us9MLNu1xc0	audio/x-m4a
COMUNION  - PERMANECER EN MI.pdf	https://drive.google.com/file/d/1tIky_6FqHpXEgwe4aYKFqK_TQ6c_LtHt/view?usp=drivesdk	1tIky_6FqHpXEgwe4aYKFqK_TQ6c_LtHt	application/pdf
COMUNION - Permaneced en mi.m4a	https://drive.google.com/file/d/1XknCXul-v4Al4-k4CHi7BFX9yaWkBTYd/view?usp=drivesdk	1XknCXul-v4Al4-k4CHi7BFX9yaWkBTYd	audio/x-m4a
OFERTORIO - Quiero estar señor en tu presencia.m4a	https://drive.google.com/file/d/1uq2bRPhV6XbcPxwY3QlTlByOLPNxFNS-/view?usp=drivesdk	1uq2bRPhV6XbcPxwY3QlTlByOLPNxFNS-	audio/x-m4a
OFERTORIO - QUIERO ESTAR SEÑOR EN TU PRESENCIA.pdf	https://drive.google.com/file/d/1Tz1hV533nh5hGOUj-ow7dpDyt1AOjzXz/view?usp=drivesdk	1Tz1hV533nh5hGOUj-ow7dpDyt1AOjzXz	application/pdf
SALMO - 21 ABRIL 24.pdf	https://drive.google.com/file/d/172Hfzvhr5UXoNYaQ5GsQGb3pdl1YN0B2/view?usp=drivesdk	172Hfzvhr5UXoNYaQ5GsQGb3pdl1YN0B2	application/pdf
SALMO - la piedra.m4a	https://drive.google.com/file/d/1XY9B2vEskWbQ9IeF7v1S-X_5euec3KLb/view?usp=drivesdk	1XY9B2vEskWbQ9IeF7v1S-X_5euec3KLb	audio/x-m4a
SALIDA  - REINA DEL CIELO.pdf	https://drive.google.com/file/d/1ozZliwOpWSuXhPvIVJS3KDOypAkriBSV/view?usp=drivesdk	1ozZliwOpWSuXhPvIVJS3KDOypAkriBSV	application/pdf
SANTO SANTO TORERO.pdf	https://drive.google.com/file/d/1nz9ugeLld3h3zTcSE5ouMSNqqfipvrvw/view?usp=drivesdk	1nz9ugeLld3h3zTcSE5ouMSNqqfipvrvw	application/pdf
CORDERO DE DIOS 2.pdf	https://drive.google.com/file/d/1CNtL2mBNhcxiuFU9-YVP_cmXVoUsDJ4S/view?usp=drivesdk	1CNtL2mBNhcxiuFU9-YVP_cmXVoUsDJ4S	application/pdf
COMUNION - EL SEÑOR ES MI PASTOR.pdf	https://drive.google.com/file/d/1eXS80tnqC9ARjwQ4-Z9PM5lkEvZ7fckV/view?usp=drivesdk	1eXS80tnqC9ARjwQ4-Z9PM5lkEvZ7fckV	application/pdf
ALELUYA ALELUYA 2.pdf	https://drive.google.com/file/d/1gLun_JvGsryFMF3OhEJGQJx1nrWke1MA/view?usp=drivesdk	1gLun_JvGsryFMF3OhEJGQJx1nrWke1MA	application/pdf
GLORIA C.pdf	https://drive.google.com/file/d/16UTPv8kQImhbEYcb5WRp6mttcdqrAzv5/view?usp=drivesdk	16UTPv8kQImhbEYcb5WRp6mttcdqrAzv5	application/pdf
OFERTORIO - RECIBE OH SEÑOR.pdf	https://drive.google.com/file/d/1GsSkW4LXjCF4Nlqm4OzJgEZYIyEJaVBm/view?usp=drivesdk	1GsSkW4LXjCF4Nlqm4OzJgEZYIyEJaVBm	application/pdf
PIEDAD - SEÑOR TEN PIEDAD.pdf	https://drive.google.com/file/d/1k-SH4j4Jskti6PLsgPBJLSdkb0TVNpFe/view?usp=drivesdk	1k-SH4j4Jskti6PLsgPBJLSdkb0TVNpFe	application/pdf
ENTRADA - CANTANDO LA ALEGRIA.pdf	https://drive.google.com/file/d/1SNmbSCVaXKBhos5WuqvD3dKusDaIiTvF/view?usp=drivesdk	1SNmbSCVaXKBhos5WuqvD3dKusDaIiTvF	application/pdf
ENTRADA CANTANDO LA ALEGRIA.m4a	https://drive.google.com/file/d/1XThjKqcDda1grM8YVE_Y5Ewz8x1yFfA0/view?usp=drivesdk	1XThjKqcDda1grM8YVE_Y5Ewz8x1yFfA0	audio/x-m4a
COMUNION - EL SEÑOR ES MI PASTOR.m4a	https://drive.google.com/file/d/1LYwZI6mxx81fTlHdE3SP72fwnZ8T_dU4/view?usp=drivesdk	1LYwZI6mxx81fTlHdE3SP72fwnZ8T_dU4	audio/x-m4a
SALIDA - REYNA DEL CIELO.m4a	https://drive.google.com/file/d/1TdyY3CRVH62iFF6XI6HtYUhonqL0ZMaS/view?usp=drivesdk	1TdyY3CRVH62iFF6XI6HtYUhonqL0ZMaS	audio/x-m4a
SANTO SANTO.pdf	https://drive.google.com/file/d/1RoWzflPAgWeFuTcE63h9db4_1G7zsza8/view?usp=drivesdk	1RoWzflPAgWeFuTcE63h9db4_1G7zsza8	application/pdf
COMUNION - MILAGRO DE AMOR.pdf	https://drive.google.com/file/d/1q9va1CIfqL5GfaQ3dxlesnBMsxkjpSZ3/view?usp=drivesdk	1q9va1CIfqL5GfaQ3dxlesnBMsxkjpSZ3	application/pdf
CORDERO DE DIOS Dm.pdf	https://drive.google.com/file/d/1dYFZcs79oiI4Fhl1JJj9YGfverhIAYkg/view?usp=drivesdk	1dYFZcs79oiI4Fhl1JJj9YGfverhIAYkg	application/pdf
`;

const mapaTipos = {
    'ENTRADA': 1,
    'ENTREDA': 1,
    'PIEDAD': 2,
    'KYRIE': 2,
    'GLORIA': 3,
    'SALMO': 4,
    'ALELUYA': 5,
    'OFERTORIO': 6,
    'SANTO': 7,
    'CORDERO': 8,
    'COMUNION': 9,
    'CUMUNION': 9,
    'COMUNIÓN': 9,
    'ACCION_GRACIAS': 10,
    'SALIDA': 11,
    'MEDITACION': 12,
    'VARIOS': 12,
    'ADORACION': 12,
    'SECUENCIA': 12
};

function cleanTitle(title) {
    // Remover extensiones
    title = title.replace(/\.(pdf|m4a|mp4|mp3|mpeg|x-m4a)$/i, '');
    // Remover "Copy of "
    title = title.replace(/Copy of /g, '');
    // Remover prefijos de momentos
    for (const prefix of Object.keys(mapaTipos)) {
        const regex = new RegExp('^' + prefix + '\\s*[-–]\\s*', 'i');
        title = title.replace(regex, '');
    }
    return title.trim();
}

const cantos = {};

const lines = rawData.trim().split('\n');
for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 4) continue;

    const [fullName, url, fileId, mime] = parts;

    // Determinar tipo_canto_id
    let tipoId = 12; // Default Meditacion
    for (const [prefix, tid] of Object.entries(mapaTipos)) {
        if (fullName.toUpperCase().startsWith(prefix)) {
            tipoId = tid;
            break;
        }
    }

    const title = cleanTitle(fullName);

    if (!cantos[title]) {
        cantos[title] = {
            titulo: title,
            tipo_id: tipoId,
            url_pdf: 'NULL',
            url_audio: 'NULL'
        };
    }

    if (mime.toLowerCase().includes('pdf')) {
        cantos[title].url_pdf = "'" + url + "'";
    } else {
        cantos[title].url_audio = "'" + url + "'";
    }
}

// Generar SQL
let sqlOutput = "-- CantoManager: Ingesta Masiva de Cantos\n";
sqlOutput += "INSERT INTO public.cantos (titulo, tipo_canto_id, url_pdf, url_audio) VALUES\n";

const values = [];
for (const c of Object.values(cantos)) {
    const t = c.titulo.replace(/'/g, "''");
    values.push(`  ('${t}', ${c.tipo_id}, ${c.url_pdf}, ${c.url_audio})`);
}

sqlOutput += values.join(',\n') + ";";

fs.writeFileSync('c:/ECOSAT/Proyectos AI/Proyectos AI/CantosCuu/supabase/migrations/06_ingesta_masiva.sql', sqlOutput);
console.log("Archivo SQL generado con éxito en migrations/06_ingesta_masiva.sql");
