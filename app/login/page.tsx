'use client';

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useState } from "react";
import classes from './AuthenticationTitle.module.css';

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    const userId = (await supabase.auth.getUser()).data?.user?.id;

    if (userId) {
      const { data: profile } = await supabase.from("profile").select("*").eq("user_id", userId).single();
      if (profile) {
        if (profile.role === "guru") {
          router.push('/guru');
        } else if (profile.role === "siswa") {
          router.push('/siswa');
        }
      }
    }

    if (error) {
      return redirect(`/login?message=${error.message}`);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    try {

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const nama = formData.get("nama") as string;
      const supabase = createClient();

      console.log(email, password, nama);

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (data) {
        await supabase.from('profile').insert({ nama: nama });
      }

      router.push('/siswa');

    } catch (error) {
      console.error(error);
    }
    // }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (isSignUp) {
      await handleSignUp(formData);
    } else {
      await handleSignIn(formData);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {isSignUp ? 'Create an account' : 'Welcome back!'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isSignUp ? 'Already have an account? ' : 'Do not have an account yet? '}
        <Anchor size="sm" component="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign in' : 'Create account'}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput name="email" label="Email" placeholder="you@example.com" required />
          <PasswordInput name="password" label="Password" placeholder="Your password" required mt="md" />
          {isSignUp && (
            <TextInput name="nama" label="Name" placeholder="Your name" required mt="md" />
          )}
          <Group justify="space-between" mt="lg">
            {!isSignUp && <Checkbox label="Remember me" />}
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        {searchParams?.message && (
          <Text mt="lg" color="red" align-text="center">
            {searchParams.message}
          </Text>
        )}
      </Paper>
    </Container>
  );
}
