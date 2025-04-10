import React, { useState, useMemo } from 'react';
import {
  Container, TextField, Typography, Paper, Box, CircularProgress,
  IconButton, Button, ThemeProvider, createTheme, CssBaseline,
  useMediaQuery, Card, CardContent, Rating, Chip, Badge, Drawer,
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider,
  Dialog, DialogTitle, DialogContent, Snackbar, Alert, Avatar,
  BottomNavigation, BottomNavigationAction
} from '@mui/material';
import {
  Search as SearchIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Send as SendIcon
} from '@mui/icons-material';
import './App.css';
import { getAIResponse, getProductRecommendations } from './services/aiService';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m ShopWise, your AI shopping assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const suggestions = [
    'Smartphones',
    'Laptops',
    'Earbuds',
    'Smartwatches',
    'Tablets',
    'Cameras',
    'Speakers',
    'Monitors',
    'Printers',
    'Smart Home Devices'
  ];

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch({ preventDefault: () => {} });
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    setSnackbar({ open: true, message: 'Removed from cart', severity: 'info' });
  };

  const handleToggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== item.id));
      setSnackbar({ open: true, message: 'Removed from favorites', severity: 'info' });
    } else {
      setFavorites([...favorites, item]);
      setSnackbar({ open: true, message: 'Added to favorites!', severity: 'success' });
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await getAIResponse(chatInput);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I couldn't process your request. Please try again later." 
      }]);
      setSnackbar({ open: true, message: 'Failed to get AI response', severity: 'error' });
    } finally {
      setChatLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await getProductRecommendations(query);
      setResults(results);
    } catch (err) {
      setError('Sorry, there was an error fetching product recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, position: 'relative', pb: 7 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1">
              ShopWise Assistant 🛍️
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton onClick={() => setChatOpen(true)} color="primary">
                <ChatIcon />
              </IconButton>
              <IconButton onClick={() => setCartOpen(true)} color="primary">
                <Badge badgeContent={cart.length} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        
          {/* Suggestion Bar */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 3 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
              <TextField
                fullWidth
                label="What would you like to buy?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., wireless earbuds"
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!query.trim() || loading}
                startIcon={<SearchIcon />}
                sx={{ height: '56px', width: '120px' }}
              >
                Search
              </Button>
            </form>
          </Paper>

        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

          {results && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
                Top Recommendations
              </Typography>
              
              {results.recommendations.map((item, index) => (
                <Card key={index} elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="h2">
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          ${item.price}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={item.rating} precision={0.1} readOnly />
                        <IconButton
                          onClick={() => handleToggleFavorite(item)}
                          color="primary"
                        >
                          {favorites.some(fav => fav.id === item.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {item.pros.map((pro, i) => (
                        <Chip
                          key={i}
                          icon={<ThumbUpIcon />}
                          label={pro}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {item.cons.map((con, i) => (
                        <Chip
                          key={i}
                          icon={<ThumbDownIcon />}
                          label={con}
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        fullWidth
                        sx={{ mr: 1 }}
                      >
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Help us refine your search
                  </Typography>
                  <Typography variant="body1">
                    {results.followUpQuestion}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
          {/* Cart Drawer */}
          <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
            <Box sx={{ width: 320, p: 2 }}>
              <Typography variant="h6" gutterBottom>Shopping Cart</Typography>
              {cart.length === 0 ? (
                <Typography color="text.secondary">Your cart is empty</Typography>
              ) : (
                <List>
                  {cart.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={item.name}
                          secondary={`$${item.price} x ${item.quantity}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id)}>
                            <RemoveIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  <ListItem>
                    <ListItemText
                      primary="Total"
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondary={`$${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`}
                    />
                  </ListItem>
                </List>
              )}
            </Box>
          </Drawer>

          {/* Chat Dialog */}
          <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Chat with ShopWise</DialogTitle>
            <DialogContent>
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
                {chatMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>AI</Avatar>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary'
                      }}
                    >
                      <Typography>{msg.content}</Typography>
                    </Paper>
                  </Box>
                ))}
                {chatLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={20} />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || chatLoading}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Bottom Navigation */}
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation showLabels>
              <BottomNavigationAction label="Search" icon={<SearchIcon />} />
              <BottomNavigationAction
                label="Cart"
                icon={
                  <Badge badgeContent={cart.length} color="secondary">
                    <CartIcon />
                  </Badge>
                }
                onClick={() => setCartOpen(true)}
              />
              <BottomNavigationAction
                label="Chat"
                icon={<ChatIcon />}
                onClick={() => setChatOpen(true)}
              />
              <BottomNavigationAction
                label="Favorites"
                icon={
                  <Badge badgeContent={favorites.length} color="secondary">
                    <FavoriteIcon />
                  </Badge>
                }
              />
            </BottomNavigation>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
