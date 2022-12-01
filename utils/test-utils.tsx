import React, { PropsWithChildren } from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { ErrorBoundary } from 'react-error-boundary'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'

import type { store as AppStore, RootState } from '../store'
// As a basic setup, import your same slice reducers
import productsReducer from '../store/reducer/product'
import bannerReducer from '../store/reducer/banner'
import systemReducer from '../store/reducer/system'
// import i18n from '../public/locales/index.mdtsx'
import ErrorFallback from 'components/_shared/layout/ErrorFallback'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: typeof AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { product: productsReducer, banner: bannerReducer, system: systemReducer },
      devTools: process.env.NODE_ENV !== 'production',
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
      <Provider store={store}>
        <RecoilRoot>
          {/* <I18nextProvider i18n={i18n}> */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
          {/* </I18nextProvider> */}
        </RecoilRoot>
      </Provider>
    )
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'