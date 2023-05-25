import { connectToMetaMask } from "@/models/auth/connectToMetaMask";
import { signIn } from "@/models/auth/signIn";
import { ethereum } from "@/models/ethereum/ethereum";
import { asyncTask } from "@/utils/asyncTask";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useUserState } from "@/states/userState";
import LoadingCircle from "../ui/LoadingCircle";
type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useUserState();
  const [message, setMessage] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      //user is already signed in
      //do nothing
    } else {
      //<<はっしー任せた！
      if (ethereum) {
        const address = ethereum.selectedAddress;
        if (address) {
          //connected, sign in
          asyncTask(async () => {
            const authenticatedUser = await signIn({ address: address });
            setUser(authenticatedUser);
          });
        } else {
          //not connected, user needs to connect and sign in manually
          setUser(null);
        }
        //>>はっしー任せた！
      } else {
        //user needs to install MetaMask
        setMessage("Please install MetaMask");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    //TODO
    //Aoi
    //ユーザー名設定してもらうAlert Dialogを出す if !user.name
    //stateを作ってchildrenとの間で画面を出し分ける
  }, [user])

  const onClickConnect = async () => {
    setIsButtonEnabled(false);
    setIsButtonLoading(true);

    const address = await connectToMetaMask();
    if (address) {
      const user = await signIn({ address: address });
      setUser(user);
    } else {
      setUser(null);
    }

    setIsButtonEnabled(true);
    setIsButtonLoading(false);
  };

  return (
    <React.Fragment>
      {user === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <React.Fragment>
          {message && <p>{message}</p>}
          {user ? (
            //TODO ここの中でさらにユーザー名設定済みかどうか条件分岐
            children
          ) : (
            <div>
              <Button
                onClick={onClickConnect}
                isEnabled={isButtonEnabled}
                isLoading={isButtonLoading}
              >
                Connect MetaMask
              </Button>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AuthProvider;
