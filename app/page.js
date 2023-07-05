'use client'
import { API, Amplify, Auth } from 'aws-amplify';
import styles from './page.module.css'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
Amplify.configure({
  aws_project_region: 'ap-southeast-1',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_CERQCSD2S',
  aws_user_pools_web_client_id: '4t2gil1710uk95sd6k8156bubh',
  aws_cognito_identity_pool_id:
    'us-east-1:f602c14b-0fde-409c-9a7e-0baccbfd87d0',
  aws_mandatory_sign_in: 'enable',
  aws_cloud_logic_custom: [
    {
      name: 'api-nextjs-serverless',
      endpoint: 'https://twu0jqizo3.execute-api.ap-southeast-1.amazonaws.com/dev',
      region: 'ap-southeast-1',
    }
  ]
});
export default function Home() {

  const postData = async () => {
    const user = await getUserData()
    const idToken = user.signInUserSession.idToken.jwtToken;
    const myInit = {
      headers: {
        Authorization: idToken
      },
      body: {
        email: user.attributes.email,
        name: user.attributes.name,
      },
      response: true,
    };
    const data = await API.post('api-nextjs-serverless', '/hello', myInit)

    console.log(data)
  }

  const getData = async () => {
    const user = await getUserData()
    const idToken = user.signInUserSession.idToken.jwtToken;
    const myInit = {
      headers: {
        Authorization: idToken
      },
      response: true,
    };
    const data = await API.get('api-nextjs-serverless', '/hello', myInit)

    console.log(data)
  }

  const getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser()

    return user;
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <h1>Serverless App</h1>
        </div>
        <div>
          <Authenticator
            loginMechanisms={['email']}
            signUpAttributes={['name']}
            socialProviders={['google']}>
            {({ signOut, user }) => (
              <main>
                <h1>Hello {user.attributes.name} ({user.attributes.email})</h1>
                <button onClick={getUserData}>Call API</button>
                <button onClick={getData}>Call Data</button>
                <button onClick={signOut}>Sign out</button>
                <div><button onClick={postData}>Post Data</button></div>
              </main>
            )}
          </Authenticator>
        </div>
      </div>
    </main>
  )
}
