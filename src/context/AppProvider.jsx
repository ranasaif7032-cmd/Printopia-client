import AuthContext from './Auth'
import CartContext from './Cart'
import ThemeProvider from './Theme'

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthContext>
        <CartContext>
          {children}
        </CartContext>
      </AuthContext>
    </ThemeProvider>
  )
}

export default AppProvider
