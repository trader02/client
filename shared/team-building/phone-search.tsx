import * as React from 'react'
import * as Kb from '../common-adapters/index'
import PhoneInput from '../signup/phone-number/phone-input'
import * as Styles from '../styles'
import * as Constants from '../constants/team-building'
import * as Container from '../util/container'
import {ServiceIdWithContact, User} from 'constants/types/team-building'
import ContinueButton from './continue-button'

type PhoneSearchProps = {
  onContinue: (user: User) => void
  search: (query: string, service: 'phone') => void
  teamBuildingSearchResults: {[query: string]: {[service in ServiceIdWithContact]: Array<User>}}
}

const PhoneSearch = (props: PhoneSearchProps) => {
  const {onContinue} = props
  const [validity, setValidity] = React.useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = React.useState<string>('')
  const [phoneInputKey, setPhoneInputKey] = React.useState<number>(0)
  const waiting = Container.useAnyWaiting(Constants.searchWaitingKey)

  const onChangeNumberCb = (phoneNumber: string, validity: boolean) => {
    setValidity(validity)
    setPhoneNumber(phoneNumber)
    if (validity) {
      props.search(phoneNumber, 'phone')
    }
  }

  let user: User | null = null
  if (
    validity &&
    props.teamBuildingSearchResults &&
    props.teamBuildingSearchResults[phoneNumber] &&
    props.teamBuildingSearchResults[phoneNumber].phone &&
    props.teamBuildingSearchResults[phoneNumber].phone[0]
  ) {
    user = props.teamBuildingSearchResults[phoneNumber].phone[0]
  }

  let _onContinue = React.useCallback(() => {
    if (!validity || !user) {
      return
    }
    onContinue(user)
    // Clear input
    setPhoneNumber('')
    setPhoneInputKey(old => old + 1)
    setValidity(false)
  }, [user, phoneNumber, setPhoneNumber, setValidity, setPhoneInputKey, onContinue])

  return (
    <>
      <Kb.Box2 direction="vertical" gap="tiny" style={styles.containerStyle} fullWidth={true}>
        <Kb.Box2 direction="vertical" gap="tiny" fullWidth={true}>
          <PhoneInput
            // Supply a key to force reset the PhoneInput state after a user is added
            key={phoneInputKey}
            autoFocus={true}
            onChangeNumber={onChangeNumberCb}
            onEnterKeyDown={_onContinue}
          />
          {!!user && user.serviceMap.keybase && <UserMatchMention username={user.username} />}
          {waiting && <Kb.ProgressIndicator type="Small" style={styles.loading} />}
        </Kb.Box2>
        <Kb.Box style={styles.spaceFillingBox} />
        <ContinueButton onClick={_onContinue} disabled={!validity && !!user} />
      </Kb.Box2>
    </>
  )
}

type UserMatchMentionProps = {
  username: string
}
export const UserMatchMention = ({username}: UserMatchMentionProps) => (
  <Kb.Box2 direction="horizontal" gap="xtiny" style={styles.userMatchMention} centerChildren={true}>
    <Kb.Icon type="iconfont-check" sizeType="Tiny" color={Styles.globalColors.greenDark} />
    <Kb.Text type="BodySmall">
      Great! That's{' '}
      <Kb.ConnectedUsernames
        colorFollowing={true}
        inline={true}
        onUsernameClicked="profile"
        type="BodySmallSemibold"
        usernames={[username]}
      />{' '}
      on Keybase.
    </Kb.Text>
  </Kb.Box2>
)

const styles = Styles.styleSheetCreate(
  () =>
    ({
      button: {flexGrow: 0},
      containerStyle: Styles.platformStyles({
        common: {
          backgroundColor: Styles.globalColors.blueGrey,
          flex: 1,
          padding: Styles.globalMargins.small,
        },
        isMobile: {
          zIndex: -1,
        },
      }),
      loading: {alignSelf: 'center'},
      spaceFillingBox: {flexGrow: 1},
      userMatchMention: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginLeft: Styles.globalMargins.small,
      },
    } as const)
)

export default PhoneSearch
