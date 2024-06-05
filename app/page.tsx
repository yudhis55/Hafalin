'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Image, Container, Title, Button, Group, Text } from '@mantine/core';
import image from './imagengaji.svg';
import classes from './HeroBullets.module.css';

const LandingPage = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/login');
  };

  return (
    <>
      <Container size="md" className={classes.container}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Yuk,<span className={classes.highlight}>Hafalin</span>
            </Title>
            <Text c="dimmed" mt="md">
              Hafalin adalah platform inovatif untuk setoran hafalan Al-Quran yang memudahkan pengguna dalam menghafal dan menyetor ayat-ayat suci. Setiap setoran hafalan dapat dinilai dan dikomentari oleh pengajar, sehingga memberikan umpan balik yang konstruktif untuk perbaikan dan motivasi.
            </Text>

            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control} onClick={handleButtonClick}>
                Mulai Hafalan
              </Button>
            </Group>
          </div>
          <Image src={image.src} className={classes.image} />
        </div>
      </Container>
    </>
  );
};

export default LandingPage;
