import { Input, Button, Text, Avatar, Card, Badge } from "@rneui/base";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { useState } from "react";
import { Icon } from "@rneui/themed";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export default function App() {
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      if (!userName.trim()) {
        Toast.show({
          type: "info",
          text1: "Info",
          text2: "Digite o nome de usuário antes de realizar a busca",
        });
        return;
      }

      const response = await axios.get(
        `https://api.github.com/users/${userName}`,
        {
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        }
      );

      setProfile(response.data);
    } catch (error) {
      if (error.message === "Request failed with status code 404") {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Usuário não encontrado na base de dados!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Erro ao obter perfil!",
        });
      }
    } finally {
      setUserName("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Input
        value={userName}
        onChangeText={setUserName}
        placeholder="Digite o nome de usuário"
      />
      <Button
        title="Buscar"
        onPress={fetchProfile}
        buttonStyle={{
          backgroundColor: "rgba(78, 116, 289, 1)",
          borderRadius: 3,
        }}
        containerStyle={{
          width: "100%",
          paddingHorizontal: 10,
        }}
      />
      {profile ? (
        <View style={styles.profileContainer}>
          <Text style={styles.username}>{profile.name}</Text>
          <Card
            containerStyle={{
              borderRadius: 30,
              shadowColor: "transparent",
            }}
          >
            <Avatar
              size={220}
              rounded
              source={{
                uri: profile.avatar_url,
              }}
            />
          </Card>

          <View style={styles.statisticsContainer}>
            <View>
              <Text style={styles.badgeTitle}>Repositórios</Text>
              <Badge
                value={profile.public_repos}
                status="success"
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
              />
            </View>

            <View>
              <Text style={styles.badgeTitle}>Seguidores</Text>
              <Badge
                value={profile.followers}
                status="success"
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
              />
            </View>

            <View>
              <Text style={styles.badgeTitle}>Seguindo</Text>
              <Badge
                value={profile.following}
                status="success"
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="alert-outline" type="ionicon" />
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Nenhum perfil encontrado
          </Text>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 130,
    flexGrow: 1,

    alignItems: "center",
  },

  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
    flexGrow: 1,

    alignItems: "center",
  },

  emptyContainer: {
    flexDirection: "row",
    paddingHorizontal: 40,
    flexGrow: 1,
    marginTop: 60,
  },

  username: {
    fontSize: 25,
    fontWeight: "900",
    marginTop: 60,
    marginBottom: 10,
  },

  statisticsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },

  badgeTitle: {
    fontWeight: "bold",
  },

  badgeText: {
    fontSize: 20,
  },

  badge: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginTop: 10,
  },
});
