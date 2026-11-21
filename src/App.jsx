import "./App.scss"
import { useEffect, useState } from "react"
import Routes from "./pages/Routes"
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd"
import { useAuth } from "./context/Auth"
import { useTheme } from "./context/Theme"
import PageLoader from "@/components/Misc/PageLoader"

const MessageBridge = () => {
  const { message } = AntdApp.useApp()
  useEffect(() => {
    window.__antdMessage = message
  }, [message])
  return null
}

// Light Mode: Clean white & light gray background (#F8FAFC), dark text (#111827), Electric Blue accents (#0866F5)
const lightThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#0866F5',
    colorPrimaryHover: '#0052CC',
    colorPrimaryActive: '#003E99',
    colorText: '#111827',
    colorTextHeading: '#111827',
    colorTextSecondary: '#4B5563',
    colorTextDescription: '#6B7280',
    colorTextPlaceholder: '#9CA3AF',
    colorLink: '#0866F5',
    colorLinkHover: '#0052CC',
    colorBgBase: '#F8FAFC',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F1F5F9',
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#E5E7EB',
    colorSplit: '#E5E7EB',
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: {
      controlOutlineWidth: 0,
      primaryColor: '#FFFFFF',
      colorPrimary: '#0866F5',
      colorPrimaryHover: '#0052CC',
      defaultColor: '#111827',
      defaultBorderColor: '#E5E7EB',
      defaultBg: '#FFFFFF',
      borderRadius: 8,
    },
    Card: {
      colorBgContainer: '#FFFFFF',
      colorBorderSecondary: '#E5E7EB',
      borderRadiusLG: 12,
    },
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F8FAFC',
    },
    Menu: {
      itemColor: '#4B5563',
      itemSelectedColor: '#FFFFFF',
      itemSelectedBg: '#0866F5',
    },
    Typography: {
      colorText: '#111827',
      colorTextHeading: '#111827',
      colorTextDescription: '#6B7280',
    },
    Input: {
      colorBgContainer: '#FFFFFF',
      colorText: '#111827',
      colorBorder: '#E5E7EB',
      activeBorderColor: '#0866F5',
      hoverBorderColor: '#0052CC',
      borderRadius: 8,
    },
    Select: {
      colorBgContainer: '#FFFFFF',
      colorBgElevated: '#FFFFFF',
      colorText: '#111827',
      colorBorder: '#E5E7EB',
      borderRadius: 8,
    },
    Table: {
      headerBg: '#F1F5F9',
      headerColor: '#111827',
      colorText: '#111827',
      colorBgContainer: '#FFFFFF',
      borderColor: '#E5E7EB',
      rowHoverBg: '#F8FAFC',
    },
    Drawer: {
      colorBgElevated: '#FFFFFF',
      colorText: '#111827',
    },
    Modal: {
      contentBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      titleColor: '#111827',
    },
    Badge: {
      colorPrimary: '#0866F5',
    },
    Tabs: {
      colorPrimary: '#0866F5',
      itemSelectedColor: '#0866F5',
      itemColor: '#4B5563',
    },
  },
}

// Dark Mode: Pure Black (#000000), Dark Black (#050505), Card (#0A0A0A), Electric Blue (#0866F5), Pure White (#FFFFFF), Light Gray (#D1D5DB), Border (#262626)
const darkThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#0866F5',
    colorPrimaryHover: '#0052CC',
    colorPrimaryActive: '#003E99',
    colorText: '#FFFFFF',
    colorTextHeading: '#FFFFFF',
    colorTextSecondary: '#D1D5DB',
    colorTextDescription: '#9CA3AF',
    colorTextPlaceholder: '#6B7280',
    colorLink: '#0866F5',
    colorLinkHover: '#3B82F6',
    colorBgBase: '#000000',
    colorBgContainer: '#0A0A0A',
    colorBgElevated: '#121212',
    colorBgLayout: '#050505',
    colorBorder: '#262626',
    colorBorderSecondary: '#262626',
    colorSplit: '#262626',
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: {
      controlOutlineWidth: 0,
      primaryColor: '#FFFFFF',
      colorPrimary: '#0866F5',
      colorPrimaryHover: '#0052CC',
      defaultColor: '#FFFFFF',
      defaultBorderColor: '#262626',
      defaultBg: '#0A0A0A',
      borderRadius: 8,
    },
    Card: {
      colorBgContainer: '#0A0A0A',
      colorBorderSecondary: '#262626',
      borderRadiusLG: 12,
    },
    Layout: {
      siderBg: '#000000',
      headerBg: '#000000',
      bodyBg: '#050505',
    },
    Menu: {
      darkItemBg: '#000000',
      darkItemSelectedBg: '#0866F5',
      darkItemColor: '#D1D5DB',
      darkItemSelectedColor: '#FFFFFF',
      itemColor: '#D1D5DB',
      itemSelectedColor: '#FFFFFF',
      itemSelectedBg: '#0866F5',
    },
    Typography: {
      colorText: '#FFFFFF',
      colorTextHeading: '#FFFFFF',
      colorTextDescription: '#D1D5DB',
    },
    Input: {
      colorBgContainer: '#050505',
      colorText: '#FFFFFF',
      colorBorder: '#262626',
      activeBorderColor: '#0866F5',
      hoverBorderColor: '#0052CC',
      borderRadius: 8,
    },
    Select: {
      colorBgContainer: '#050505',
      colorBgElevated: '#0A0A0A',
      colorText: '#FFFFFF',
      colorBorder: '#262626',
      borderRadius: 8,
    },
    Table: {
      headerBg: '#050505',
      headerColor: '#FFFFFF',
      colorText: '#FFFFFF',
      colorBgContainer: '#0A0A0A',
      borderColor: '#262626',
      rowHoverBg: '#141414',
    },
    Drawer: {
      colorBgElevated: '#0A0A0A',
      colorText: '#FFFFFF',
    },
    Modal: {
      contentBg: '#0A0A0A',
      headerBg: '#0A0A0A',
      titleColor: '#FFFFFF',
      colorBorder: '#262626',
    },
    Badge: {
      colorPrimary: '#0866F5',
    },
    Tabs: {
      colorPrimary: '#0866F5',
      itemSelectedColor: '#0866F5',
      itemColor: '#D1D5DB',
    },
  },
}

const App = () => {
  const { isAppLoading } = useAuth()
  const { isDarkMode } = useTheme()
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false)

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : lightThemeConfig}>
      <AntdApp>
        <MessageBridge />
        <Routes />
        {!initialLoadingComplete && (
          <PageLoader
            isLoading={isAppLoading}
            minDuration={900}
            maxTimeout={3500}
            onComplete={() => setInitialLoadingComplete(true)}
          />
        )}
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
