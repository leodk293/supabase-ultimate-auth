import { createClient } from "./supabase/client";

const supabase = createClient();

export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) {
        console.error(error.message);
    }
}

export async function signOut() {
    await supabase.auth.signOut();
}

const { data: { user } } = await supabase.auth.getUser();

if (user) {
    await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        avatar_url: user.user_metadata.avatar_url
    });
}