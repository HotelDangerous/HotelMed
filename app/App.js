
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StatusBar,
  Platform,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";

// Notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// =============== Utility Functions ===============
function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatTime(hour, minute) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return h + ":" + pad(minute) + " " + ampm;
}

function dateToKey(date) {
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}

function todayKey() {
  return dateToKey(new Date());
}

function previousDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
}

function computeGlobalStreak(medicines) {
  const active = medicines.filter((m) => m.enabled);
  if (active.length === 0) return 0;

  let streak = 0;
  let cursor = new Date();

  for (let i = 0; i < 365; i++) {
    const key = dateToKey(cursor);
    const allTaken = active.every((m) => m.takenDates.includes(key));
    if (!allTaken) break;

    streak++;
    cursor = previousDay(cursor);
  }

  return streak;
}

// =============== MAIN APP ===============
export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // ------- Load medicines -------
  useEffect(() => {
    async function loadData() {
      try {
        const json = await AsyncStorage.getItem("HOTELMED_DATA");
        if (json !== null) {
          const parsed = JSON.parse(json);
          if (parsed.medicines) {
            setMedicines(parsed.medicines);
          }
        }
      } catch (e) {}
      setLoaded(true);
    }

    loadData();
  }, []);

  async function saveMedicines(updated) {
    await AsyncStorage.setItem(
      "HOTELMED_DATA",
      JSON.stringify({ medicines: updated })
    );
  }

  // ------- Notification permission -------
  const [permissionStatus, setPermissionStatus] = useState("unknown");

  useEffect(() => {
    async function askPermission() {
      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;

      if (status !== "granted") {
        const newStatus = await Notifications.requestPermissionsAsync();
        status = newStatus.status;
      }

      setPermissionStatus(status);
    }

    askPermission();
  }, []);

  async function scheduleAlarm(name, hour, minute) {
    if (permissionStatus !== "granted") return null;

    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for your medicine 💊",
          body: `Please take "${name}".`,
          sound: true,
        },
        trigger: { hour, minute, repeats: true },
      });
    } catch (e) {
      return null;
    }
  }

  async function cancelAlarm(id) {
    if (!id) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {}
  }

  // ------- CRUD -------
  async function addMedicine() {
    const name = newName.trim();
    if (!name) return;

    const hour = newTime.getHours();
    const minute = newTime.getMinutes();

    const notificationId = await scheduleAlarm(name, hour, minute);

    const medicine = {
      id: Date.now().toString(),
      name,
      hour,
      minute,
      enabled: true,
      takenDates: [],
      notificationId,
    };

    const updated = [...medicines, medicine];
    setMedicines(updated);
    saveMedicines(updated);

    setNewName("");
    setNewTime(new Date());
    setModalVisible(false);
  }

  async function deleteMedicine(id) {
    const med = medicines.find((m) => m.id === id);
    if (med?.notificationId) await cancelAlarm(med.notificationId);

    const updated = medicines.filter((m) => m.id !== id);
    setMedicines(updated);
    saveMedicines(updated);
  }

  async function toggleEnabled(id) {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    if (med.enabled) {
      if (med.notificationId) await cancelAlarm(med.notificationId);

      const updated = medicines.map((m) =>
        m.id === id ? { ...m, enabled: false, notificationId: null } : m
      );
      setMedicines(updated);
      saveMedicines(updated);
    } else {
      const newId = await scheduleAlarm(med.name, med.hour, med.minute);

      const updated = medicines.map((m) =>
        m.id === id ? { ...m, enabled: true, notificationId: newId } : m
      );
      setMedicines(updated);
      saveMedicines(updated);
    }
  }

  function markTakenToday(id) {
    const today = todayKey();

    const updated = medicines.map((m) =>
      m.id === id
        ? {
            ...m,
            takenDates: m.takenDates.includes(today)
              ? m.takenDates
              : [...m.takenDates, today],
          }
        : m
    );

    setMedicines(updated);
    saveMedicines(updated);
  }

  // ------- UI -------
  function renderItem({ item }) {
    const taken = item.takenDates.includes(todayKey());
    const days = item.takenDates.length;

    return (
      <View
        style={{
          backgroundColor: "#1a1a1a",
          padding: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#333",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            {item.name}
          </Text>

          <TouchableOpacity
            onPress={() => toggleEnabled(item.id)}
            style={{
              backgroundColor: item.enabled ? "#C80085" : "#555",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: "#fff" }}>
              {item.enabled ? "On" : "Off"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: "#fff" }}>
          Alarm:{" "}
          <Text style={{ color: "#FBBF00", fontWeight: "700" }}>
            {formatTime(item.hour, item.minute)}
          </Text>
        </Text>

        <Text style={{ color: "#fff", opacity: 0.8, marginBottom: 12 }}>
          Days taken:{" "}
          <Text style={{ color: "#FBBF00", fontWeight: "700" }}>{days}</Text>
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            disabled={taken}
            onPress={() => markTakenToday(item.id)}
            style={{
              backgroundColor: "#C80085",
              opacity: taken ? 0.5 : 1,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: "#fff" }}>
              {taken ? "Taken Today ✔" : "Mark Taken"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteMedicine(item.id)}>
            <Text style={{ color: "#FBBF00", fontWeight: "700" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const streak = computeGlobalStreak(medicines);

  return (
    <LinearGradient colors={["#000", "#333"]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 26,    // <<--- FIXED SMALL SPACING
          paddingBottom: 52, // <<--- FIXED SMALL SPACING
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
          HotelMed
        </Text>

        <Text style={{ color: "#fff", opacity: 0.8 }}>
          Medicine alarm & streak tracker
        </Text>

        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: "#FBBF00",
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#fff", opacity: 0.8 }}>All-meds streak</Text>
          <Text
            style={{
              color: "#FBBF00",
              fontSize: 22,
              fontWeight: "700",
              marginTop: 4,
            }}
          >
            {streak} day{streak === 1 ? "" : "s"}
          </Text>
        </View>

        {!loaded ? (
          <Text style={{ color: "#fff" }}>Loading…</Text>
        ) : (
          <FlatList
            data={medicines}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
                No medicines yet. Tap “Add Medicine”.
              </Text>
            }
          />
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#C80085",
            paddingVertical: 12,
            borderRadius: 999,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            + Add Medicine
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#1a1a1a",
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#333",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
              Add Medicine
            </Text>

            <Text style={{ color: "#fff", marginTop: 14 }}>Name:</Text>

            <TextInput
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#444",
                marginBottom: 12,
              }}
              placeholder="Name"
              placeholderTextColor="#777"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={{ color: "#fff" }}>Time:</Text>

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                backgroundColor: "#000",
                padding: 12,
                borderRadius: 8,
                borderColor: "#444",
                borderWidth: 1,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {formatTime(newTime.getHours(), newTime.getMinutes())}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                mode="time"
                value={newTime}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowPicker(false);
                  if (date) setNewTime(date);
                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={addMedicine}>
                <Text style={{ color: "#C80085", fontWeight: "700" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
