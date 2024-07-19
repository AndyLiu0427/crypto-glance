import { useAccount, useBalance, useEnsName } from 'wagmi'
import { config } from '../config'
import { getBalance } from '@wagmi/core'

export function Profile() {
  const { address } = useAccount()
  const { data, error, status } = useEnsName({ address })
  const balance = useBalance({
    address: address,
  })
  console.log('address', address)
  console.log('balance', balance)
  // console.log('data', data)
  // console.log('error', error)
  // console.log('status', status)
  if (status === 'pending') return <div>Loading ENS name</div>
  if (status === 'error')
    return <div>Error fetching ENS name: {error.message}</div>
  return (
      <div>
        {/* <div>Balance: {balance?.formatted}</div> */}
        <div>ENS name: {data}</div>
      </div>
  )
}