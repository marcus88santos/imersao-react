import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import BoxMouseOver from '../src/components/BoxMouseOver'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM4NzM4MCwiZXhwIjoxOTU4OTYzMzgwfQ.Id2NkgAiuy0H0tY_J9p0Wlh78PT7L9BkUbcg2I8JeE8'
const SUPABASE_URL = 'https://wowfroalsaoxwcokqoxm.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABE_ANON_KEY)

export default function ChatPage () {
	const [messageText, setMessageText] = React.useState('')
	const [messages, setMessages] = React.useState([])
	const [loaderVisible, setLoaderVisible] = React.useState('flex')
	const [sendMessageOver, setSendMessageOver] = React.useState(false)
	const router = useRouter()

	React.useEffect(() => {
		setTimeout(() => {
			supabaseClient
				.from('messages')
				.select('*')
				.order('id', { ascending: false })
				.then(({ data }) => {
					setLoaderVisible('none')
					setMessages(data)
				})
		}, 500)
	}, [])

	function handleNewMessage (text) {
		const message = {
			username: router.query.username,
			text: text,
		}
		supabaseClient
			.from('messages')
			.insert([message])
			.then(({ data }) => {
				setMessages([data[0], ...messages])
			})
		setMessageText('')
	}

	return (
		<Box
			styleSheet={{
				display: 'flex',
				alignItems: { xs: 'center', sm: 'end', md: 'end', lg: 'center' },
				paddingBottom: { xs: '0', sm: '20vw', md: '18vw', lg: '0' },
				justifyContent: 'center',
				backgroundBlendMode: 'multiply',
				backgroundColor: appConfig.theme.colors.primary[300],
				backgroundImage: 'url(/background.gif)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: {
					xs: '100%',
					sm: '120%',
					md: '105%',
					lg: '100% 110%',
				},
				'background-position': {
					sm: '60% top',
					md: '60% top',
					lg: '60% 50%',
				},
			}}>
			<Box
				styleSheet={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700] + 'f1',
					height: '100%',
					maxWidth: '70%',
					maxHeight: '95vh',
					padding: '32px',
				}}>
				<Header username={router.query.username} />
				<Box
					styleSheet={{
						position: 'relative',
						display: 'flex',
						flex: 1,
						height: '80%',
						backgroundColor: appConfig.theme.colors.neutrals[600] + '99',
						flexDirection: 'column',
						dorderRadius: '5px',
						padding: '16px',
						justifyContent: 'space-between',
					}}>
					<Image
						style={{
							alignSelf: 'center',
							display: loaderVisible,
							height: '12em',
							marginTop: '2.5em',
						}}
						src={`/headsetLoading.gif`}></Image>
					<MessageList
						messageList={messages}
						setMessageList={setMessages}
						supabaseClient={supabaseClient}
						username={router.query.username}
					/>
					<Box
						as='form'
						styleSheet={{
							display: 'flex',
							alignItems: 'center',
						}}>
						<TextField
							value={messageText}
							onChange={event => {
								setMessageText(event.target.value)
							}}
							onKeyPress={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleNewMessage(messageText)
								}
							}}
							placeholder='Insira sua mensagem aqui...'
							type='textarea'
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '8px',
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
						<ButtonSendSticker
							onStickerClick={sticker => {
								handleNewMessage(':sticker:' + sticker)
							}}
						/>
						<FontAwesomeIcon
							onClick={e => {
								if (messageText.length > 0) {
									e.preventDefault()
									handleNewMessage(messageText)
								}
							}}
							onMouseEnter={() => {
								if (messageText.length > 0) setSendMessageOver(true)
							}}
							onMouseLeave={() => setSendMessageOver(false)}
							style={{
								marginLeft: '10px',
								cursor: 'pointer',
								color: sendMessageOver
									? appConfig.theme.colors.primary[400]
									: 'white',
								fontSize: '20px',
							}}
							icon={faPaperPlane}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header (props) {
	const router = useRouter()
	return (
		<>
			<Box
				styleSheet={{
					width: '100%',
					marginBottom: '16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Text
					styleSheet={{ color: appConfig.theme.colors.neutrals['200'] }}
					variant='heading5'>
					{`Chat: `}
					<span
						style={{
							color: appConfig.theme.colors.primary['200'],
							fontSize: '10px',
							fontWeight: 'normal',
						}}>
						@{props.username}
					</span>
				</Text>
				<Button
					onClick={() => {
						router.push('../')
					}}
					variant='tertiary'
					colorVariant='neutral'
					label='Logout'
					href='/'
				/>
			</Box>
		</>
	)
}

function MessageList (props) {
	const [mouseOver, setMouseOver] = React.useState(0)
	function handleDelete (id) {
		props.supabaseClient
			.from('messages')
			.delete()
			.match({ id: id })
			.then(() => {
				props.supabaseClient
					.from('messages')
					.select('*')
					.order('id', { ascending: false })
					.then(({ data }) => {
						props.setMessageList(data)
					})
			})
		props.setMessageList(props.messageList.filter(i => i.id !== id))
	}
	return (
		<Box
			tag='ul'
			styleSheet={{
				color: appConfig.theme.colors.neutrals['000'],
				display: 'flex',
				flex: 1,
				flexDirection: 'column-reverse',
				marginBottom: '5px',
				overflow: 'auto',
			}}>
			{props.messageList.map(msg => {
				return (
					<Text
						key={msg.id}
						tag='li'
						styleSheet={{
							borderLeft:
								'1px solid' + appConfig.theme.colors.primary[400],
							borderRadius: '10px',
							fontSize: '12px',
							marginBottom: '7px',
							padding: '5px 10px',
							wordBreak: 'break-word',
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							},
						}}>
						<Box
							styleSheet={{
								alignItems: 'center',
								display: 'flex',
								flexDirection: 'row !important',
								marginBottom: '8px',
							}}>
							<a
								href={`https://github.com/${msg.username}`}
								target='_blank'
								rel='noopener noreferrer'
								style={{
									alignItems: 'center',
									display: 'flex',
									textDecoration: 'none',
								}}
								onMouseEnter={() => {
									setMouseOver(-msg.id)
								}}
								onMouseLeave={() => {
									setMouseOver(0)
								}}>
								<Image
									styleSheet={{
										width: '20px',
										height: '20px',
										borderRadius: '50%',
										display: 'inline-block',
										marginRight: '8px',
									}}
									src={`https://github.com/${msg.username}.png`}
								/>
								<Text
									styleSheet={{
										fontSize: '12px',
										color: appConfig.theme.colors.primary[300],
									}}
									tag='strong'>
									{msg.username}
								</Text>
								{msg.id + mouseOver == 0 ? (
									<BoxMouseOver username={msg.username} />
								) : null}
							</a>
							<Text
								styleSheet={{
									color: appConfig.theme.colors.neutrals[300],
									fontSize: '10px',
									marginLeft: '8px',
									paddingTop: '2px',
								}}
								tag='span'>
								{new Date().toLocaleDateString()}
							</Text>
							{msg.username === props.username && (
								<FontAwesomeIcon
									onClick={() => handleDelete(msg.id)}
									style={{
										cursor: 'pointer',
										marginLeft: '10px',
									}}
									icon={faTrashAlt}
								/>
							)}
						</Box>
						{msg.text.startsWith(':sticker:') ? (
							<Image
								style={{
									maxHeight: '150px',
								}}
								src={msg.text.replace(':sticker:', '')}
							/>
						) : (
							msg.text
						)}
						{/* {msg.text} */}
					</Text>
				)
			})}
		</Box>
	)
}
