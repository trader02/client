import * as React from 'react'
import * as Container from '../util/container'
import CryptoRoot from './index'

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

const mergeProps = () => ({})

const ContainerWrapper = props => <CryptoRoot {...props} />
ContainerWrapper.navigationOptions = {
  title: 'Crypto Toolkit',
}

export default Container.connect(mapStateToProps, mapDispatchToProps, mergeProps)(ContainerWrapper)
