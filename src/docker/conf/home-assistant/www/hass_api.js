import { HA_TOKEN } from "./ha_token.js";

export async function isFaceAuthenticated() {
  try {
    const res = await fetch(`/api/states/input_boolean.face_authenticated`, {
      headers: {
        "Authorization": `Bearer ${HA_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    return data.state === "on";
  } catch (e) {
    console.error("isFaceAuthenticated failed", e);
    return false;
  }
}

export async function setFaceAuthenticated(state = true) {
  try {
    await fetch(`/api/services/input_boolean/${state ? 'turn_on' : 'turn_off'}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HA_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entity_id: "input_boolean.face_authenticated" })
    });
  } catch (e) {
    console.error("Failed to set input_boolean.face_authenticated:", e);
  }
}

export async function isFaceEnrolled() {
  try {
    const res = await fetch(`/api/states/input_boolean.enrolled_face`, {
      headers: {
        "Authorization": `Bearer ${HA_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    return data.state === "on";
  } catch (e) {
    console.error("isFaceEnrolled failed", e);
    return false;
  }
}

export async function setFaceEnrolled(state = true) {
  try {
    await fetch(`/api/services/input_boolean/${state ? 'turn_on' : 'turn_off'}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HA_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entity_id: "input_boolean.enrolled_face" })
    });
  } catch (e) {
    console.error("Failed to set input_boolean.enrolled_face:", e);
  }
}