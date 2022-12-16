import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { useI18n } from 'hooks'
import { IProductItem } from 'types/product'
import SnackBar from 'components/_shared/SnackBar'
import Container from 'components/_shared/Container'
import { useSnackbar } from 'components/_shared/SnackBar/useSnackBar'
import BuyItemModal from 'components/BuyItemModal/indedx'
import Loading from 'components/_shared/Loding'
import styles from './itemDetailPage.module.scss'
import { ParsedUrlQuery } from 'querystring'
import Products from 'lib/models/Products'
import Users from 'lib/models/Users'
import { dbConnect } from 'lib/dbConnect'
import { currencyFormatter } from 'utils/currencyFormatter'

const ItemDetailPage: NextPage<AppProps> = ({ pageProps }: AppProps) => {
  const t = useI18n()
  const [openModal, setOpenModal] = useState(false)
  const { message, setMessage } = useSnackbar(3000)
  const router = useRouter()
  const { product } = pageProps
  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }
  if (router.isFallback) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>Toyz Item</title>
      </Head>
      <Container color='white' width='md'>
        <header className={styles.header}>{product?.title}</header>
        <main className={styles.main}>
          <div className={styles.image}>
            <img src={product?.image} alt='items' />
          </div>

          <div className={styles.content}>
            <dl>
              <div>
                <dt>{`${t('common:price')}`}</dt>
                <dd>
                  {currencyFormatter(product?.price)} <sub>(원)</sub>
                </dd>
              </div>
              <div>
                <dt>{`${t('common:owner')}`}</dt>
                <dd>{product?.owner.name}</dd>
              </div>
              <div>
                <dt> {`${t('common:date')}`}</dt>
                <dd>{dayjs(product?.createdAt).format('YYYY-MM-DD')}</dd>
              </div>
            </dl>
            <div className={styles.description}>
              <div>{product?.description}</div>
            </div>
            <div className={styles.buttonWrapper}>
              <button type='button' className={styles.buyButton} onClick={handleOpenModal}>
                구매
              </button>
            </div>
          </div>
        </main>
        {openModal && (
          <BuyItemModal
            onClose={handleCloseModal}
            title={product?.name}
            price={product?.price}
            setMessage={setMessage}
          />
        )}
        {message && <SnackBar message={message} setMessage={setMessage} />}
      </Container>
    </>
  )
}

interface IGetStaticProps {
  locale: string
  locales: string[]
  params: ParsedUrlQuery
}

export const getServerSideProps = async (context: IGetStaticProps) => {
  const { locale, locales, params } = context
  await dbConnect()
  const product = await Products.findOne({ _id: params.itemId }).populate({
    path: 'owner',
    model: Users,
    select: '-password',
  })

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locales,
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}

export default ItemDetailPage
