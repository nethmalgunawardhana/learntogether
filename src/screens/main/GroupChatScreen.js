import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import {
  addMessageToGroup,
  addMaterialToGroup,
  addQuestionToGroup,
  addAnswerToQuestion,
  addReactionToMessage,
  rateMaterial,
  incrementMaterialView,
  togglePinMaterial,
  voteAnswer,
  markAnswerAsAccepted,
  updateQuestionStatus,
  selectGroupById,
} from '../../store/slices/studyGroupsSlice';
import { formatDate } from '../../utils/helpers';

const GroupChatScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const dispatch = useDispatch();
  const group = useSelector(selectGroupById(groupId));
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'materials', 'questions'
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [materialCategory, setMaterialCategory] = useState('general');
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionTags, setQuestionTags] = useState([]);
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [materialSearchQuery, setMaterialSearchQuery] = useState('');
  const [materialSortBy, setMaterialSortBy] = useState('newest');
  const [materialFilterCategory, setMaterialFilterCategory] = useState('all');
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionFilterStatus, setQuestionFilterStatus] = useState('all');
  const [questionSortBy, setQuestionSortBy] = useState('newest');
  const flatListRef = useRef(null);

  const MATERIAL_CATEGORIES = ['general', 'lecture-notes', 'textbook', 'video', 'article', 'practice', 'other'];
  const QUESTION_TAGS = ['concept', 'homework', 'exam-prep', 'project', 'general'];

  const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥'];

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleImageAction = () => {
    Alert.alert(
      'Send Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handlePickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedImage) return;

    const message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      userId: userData.uid,
      userName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
      image: selectedImage || null,
    };

    dispatch(addMessageToGroup({ groupId, message }));
    setMessageText('');
    setSelectedImage(null);
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setMaterialFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          size: result.assets[0].size,
          mimeType: result.assets[0].mimeType,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleAddMaterial = () => {
    if (!materialTitle.trim()) {
      Alert.alert('Error', 'Please enter material title');
      return;
    }

    const material = {
      id: Date.now().toString(),
      title: materialTitle.trim(),
      description: materialDescription.trim(),
      url: materialUrl.trim(),
      file: materialFile || null,
      category: materialCategory || 'general',
      uploadedBy: userData.uid,
      uploaderName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
      views: 0,
      ratings: {},
      averageRating: 0,
      totalRatings: 0,
      pinned: false,
    };

    dispatch(addMaterialToGroup({ groupId, material }));
    setMaterialModalVisible(false);
    setMaterialTitle('');
    setMaterialDescription('');
    setMaterialUrl('');
    setMaterialFile(null);
    setMaterialCategory('general');
    Alert.alert('Success', 'Material added successfully!');
  };

  const handleAskQuestion = () => {
    if (!questionTitle.trim()) {
      Alert.alert('Error', 'Please enter question title');
      return;
    }

    const question = {
      id: Date.now().toString(),
      title: questionTitle.trim(),
      description: questionDescription.trim(),
      tags: questionTags,
      askedBy: userData.uid,
      askerName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
      answers: [],
      status: 'open',
      acceptedAnswerId: null,
    };

    dispatch(addQuestionToGroup({ groupId, question }));
    setQuestionModalVisible(false);
    setQuestionTitle('');
    setQuestionDescription('');
    setQuestionTags([]);
    Alert.alert('Success', 'Question posted successfully!');
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) {
      Alert.alert('Error', 'Please enter your answer');
      return;
    }

    const answer = {
      id: Date.now().toString(),
      text: answerText.trim(),
      userId: userData.uid,
      userName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
      upvotes: [],
      downvotes: [],
      score: 0,
    };

    dispatch(addAnswerToQuestion({ groupId, questionId: selectedQuestion.id, answer }));
    setAnswerModalVisible(false);
    setAnswerText('');
    setSelectedQuestion(null);
    Alert.alert('Success', 'Answer submitted!');
  };

  // Material handlers
  const handleRateMaterial = (materialId, rating) => {
    dispatch(rateMaterial({ groupId, materialId, rating, userId: userData.uid }));
  };

  const handleViewMaterial = (materialId) => {
    dispatch(incrementMaterialView({ groupId, materialId }));
  };

  const handleTogglePin = (materialId) => {
    dispatch(togglePinMaterial({ groupId, materialId }));
  };

  // Q&A handlers
  const handleVoteAnswer = (questionId, answerId, voteType) => {
    dispatch(voteAnswer({ groupId, questionId, answerId, voteType, userId: userData.uid }));
  };

  const handleAcceptAnswer = (questionId, answerId) => {
    dispatch(markAnswerAsAccepted({ groupId, questionId, answerId }));
  };

  // Filter and sort materials
  const getFilteredAndSortedMaterials = () => {
    let materials = group?.materials || [];

    // Filter by search
    if (materialSearchQuery.trim()) {
      materials = materials.filter(mat =>
        mat.title?.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
        mat.description?.toLowerCase().includes(materialSearchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (materialFilterCategory !== 'all') {
      materials = materials.filter(mat => (mat.category || 'general') === materialFilterCategory);
    }

    // Sort materials
    materials = [...materials].sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      
      switch (materialSortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'most-viewed':
          return (b.views || 0) - (a.views || 0);
        case 'highest-rated':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    return materials;
  };

  // Filter and sort questions
  const getFilteredAndSortedQuestions = () => {
    let questions = group?.questions || [];

    // Filter by search
    if (questionSearchQuery.trim()) {
      questions = questions.filter(q =>
        q.title?.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        q.description?.toLowerCase().includes(questionSearchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (questionFilterStatus !== 'all') {
      questions = questions.filter(q => (q.status || 'open') === questionFilterStatus);
    }

    // Sort questions
    questions = [...questions].sort((a, b) => {
      switch (questionSortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'most-answered':
          return (b.answers?.length || 0) - (a.answers?.length || 0);
        case 'unanswered':
          return (a.answers?.length || 0) - (b.answers?.length || 0);
        default:
          return 0;
      }
    });

    return questions;
  };

  const handleReaction = (messageId, emoji) => {
    dispatch(addReactionToMessage({
      groupId,
      messageId,
      emoji,
      userId: userData.uid
    }));
    setShowEmojiPicker(null);
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === userData.uid;
    const reactions = item.reactions || {};
    const hasReactions = Object.keys(reactions).filter(emoji => reactions[emoji]?.length > 0).length > 0;

    return (
      <View style={[styles.messageWrapper, isOwnMessage && styles.messageWrapperOwn]}>
        <TouchableOpacity
          onLongPress={() => setShowEmojiPicker(showEmojiPicker === item.id ? null : item.id)}
          activeOpacity={0.9}
          style={styles.messageTouchable}
        >
          <View style={[
            styles.messageBubble,
            { backgroundColor: isOwnMessage ? COLORS.primary : themeColors.card },
            !isOwnMessage && { borderColor: themeColors.border, borderWidth: 1 }
          ]}>
            {!isOwnMessage && (
              <Text style={[styles.messageSender, { color: COLORS.accent }]}>
                {item.userName}
              </Text>
            )}
            {item.image && (
              <TouchableOpacity onPress={() => setFullScreenImage(item.image)}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            {item.text && (
              <Text style={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : themeColors.text }]}>
                {item.text}
              </Text>
            )}
            <View style={styles.messageFooter}>
              <Text style={[styles.messageTime, { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : themeColors.textSecondary }]}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Reactions Display */}
        {(hasReactions || showEmojiPicker === item.id) && (
          <View style={[styles.reactionsContainer, isOwnMessage && styles.reactionsContainerOwn]}>
            {Object.entries(reactions)
              .filter(([emoji, userIds]) => userIds && userIds.length > 0)
              .map(([emoji, userIds]) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.reactionBubble,
                    { backgroundColor: themeColors.background, borderColor: themeColors.border },
                    userIds.includes(userData.uid) && { backgroundColor: `${COLORS.primary}15`, borderColor: COLORS.primary }
                  ]}
                  onPress={() => handleReaction(item.id, emoji)}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                  <Text style={[styles.reactionCount, { color: userIds.includes(userData.uid) ? COLORS.primary : themeColors.textSecondary }]}>
                    {userIds.length}
                  </Text>
                </TouchableOpacity>
              ))}
            {showEmojiPicker !== item.id && (
              <TouchableOpacity
                style={[styles.reactionBubble, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}
                onPress={() => setShowEmojiPicker(item.id)}
              >
                <Feather name="plus" size={14} color={themeColors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker === item.id && (
          <View style={[styles.emojiPicker, { backgroundColor: themeColors.card, borderColor: themeColors.border }, isOwnMessage && styles.emojiPickerOwn]}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiOption}
                onPress={() => handleReaction(item.id, emoji)}
              >
                <Text style={styles.emojiOptionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.emojiOption}
              onPress={() => setShowEmojiPicker(null)}
            >
              <Feather name="x" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderMaterial = ({ item }) => {
    const userRating = item.ratings?.[userData.uid] || 0;
    const materialCategory = item.category || 'general';
    const getCategoryIcon = (category) => {
      const icons = {
        'lecture-notes': 'book-open',
        'textbook': 'book',
        'video': 'video',
        'article': 'file-text',
        'practice': 'edit',
        'general': 'folder',
        'other': 'file'
      };
      return icons[category] || 'folder';
    };

    return (
      <View style={[styles.materialCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        {item.pinned && item.uploadedBy === userData.uid && (
          <TouchableOpacity 
            style={[styles.pinnedBadge, { backgroundColor: `${COLORS.accent}15` }]}
            onPress={() => handleTogglePin(item.id)}
          >
            <Feather name="bookmark" size={14} color={COLORS.accent} />
            <Text style={[styles.pinnedText, { color: COLORS.accent }]}>Pinned - Tap to unpin</Text>
          </TouchableOpacity>
        )}
        {item.pinned && item.uploadedBy !== userData.uid && (
          <View style={[styles.pinnedBadge, { backgroundColor: `${COLORS.accent}15` }]}>
            <Feather name="bookmark" size={14} color={COLORS.accent} />
            <Text style={[styles.pinnedText, { color: COLORS.accent }]}>Pinned</Text>
          </View>
        )}
        <View style={styles.materialHeader}>
          <View style={[styles.materialIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
            <Feather name={getCategoryIcon(materialCategory)} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.materialInfo}>
            <Text style={[styles.materialTitle, { color: themeColors.text }]}>{item.title}</Text>
            <View style={styles.materialMeta}>
              <Text style={[styles.materialUploader, { color: themeColors.textSecondary }]}>
                by {item.uploaderName}
              </Text>
              <Text style={[styles.materialDot, { color: themeColors.textSecondary }]}> • </Text>
              <Text style={[styles.materialDate, { color: themeColors.textSecondary }]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
          {item.uploadedBy === userData.uid && !item.pinned && (
            <TouchableOpacity onPress={() => handleTogglePin(item.id)} style={styles.pinButton}>
              <Feather name="bookmark" size={18} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.categoryText, { color: COLORS.primary }]}>
            {materialCategory.replace('-', ' ').toUpperCase()}
          </Text>
        </View>

        {item.description && (
          <Text style={[styles.materialDescription, { color: themeColors.textSecondary }]}>
            {item.description}
          </Text>
        )}
        
        {item.file && (
          <View style={[styles.fileInfo, { backgroundColor: themeColors.background }]}>
            <Feather name="paperclip" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.fileName, { color: themeColors.text }]}>{item.file.name}</Text>
            <Text style={[styles.fileSize, { color: themeColors.textSecondary }]}>
              {(item.file.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
        )}
        
        {/* Stats Row */}
        <View style={styles.materialStats}>
          <View style={styles.statItem}>
            <Feather name="eye" size={14} color={themeColors.textSecondary} />
            <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
              {item.views || 0} views
            </Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="star" size={14} color={COLORS.secondary} />
            <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
              {item.averageRating ? item.averageRating.toFixed(1) : '0.0'} ({item.totalRatings || 0})
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={[styles.ratingLabel, { color: themeColors.text }]}>Rate this material:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRateMaterial(item.id, star)}
                style={styles.starButton}
              >
                <Feather
                  name={star <= userRating ? 'star' : 'star'}
                  size={20}
                  color={star <= userRating ? COLORS.secondary : themeColors.textSecondary}
                  style={{ opacity: star <= userRating ? 1 : 0.3 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        {item.url && (
          <TouchableOpacity
            style={[styles.materialLink, { backgroundColor: COLORS.primary }]}
            onPress={() => handleViewMaterial(item.id)}
          >
            <Feather name="external-link" size={16} color="#FFFFFF" />
            <Text style={[styles.materialLinkText, { color: '#FFFFFF' }]}>Open Material</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderQuestion = ({ item }) => {
    const questionStatus = item.status || 'open';
    const questionTags = Array.isArray(item.tags) ? item.tags : [];
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'answered':
          return COLORS.accent;
        case 'closed':
          return COLORS.error;
        default:
          return COLORS.secondary;
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'answered':
          return 'check-circle';
        case 'closed':
          return 'x-circle';
        default:
          return 'help-circle';
      }
    };

    // Sort answers by score and accepted status
    const sortedAnswers = item.answers ? [...item.answers].sort((a, b) => {
      if (a.id === item.acceptedAnswerId) return -1;
      if (b.id === item.acceptedAnswerId) return 1;
      return (b.score || 0) - (a.score || 0);
    }) : [];

    return (
      <View style={[styles.questionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <View style={styles.questionHeader}>
          <View style={[styles.questionIcon, { backgroundColor: `${getStatusColor(questionStatus)}15` }]}>
            <Feather name={getStatusIcon(questionStatus)} size={20} color={getStatusColor(questionStatus)} />
          </View>
          <View style={styles.questionInfo}>
            <Text style={[styles.questionTitle, { color: themeColors.text }]}>{item.title}</Text>
            <View style={styles.questionMeta}>
              <Text style={[styles.questionAsker, { color: themeColors.textSecondary }]}>
                by {item.askerName}
              </Text>
              <Text style={[styles.materialDot, { color: themeColors.textSecondary }]}> • </Text>
              <Text style={[styles.questionDate, { color: themeColors.textSecondary }]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status and Tags */}
        <View style={styles.questionTagsRow}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(questionStatus)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(questionStatus) }]}>
              {questionStatus.toUpperCase()}
            </Text>
          </View>
          {questionTags.map((tag) => (
            <View key={tag} style={[styles.tagBadge, { backgroundColor: themeColors.background }]}>
              <Text style={[styles.tagText, { color: COLORS.primary }]}>#{tag}</Text>
            </View>
          ))}
        </View>

        {item.description && (
          <Text style={[styles.questionDescription, { color: themeColors.textSecondary }]}>
            {item.description}
          </Text>
        )}

        <View style={styles.questionFooter}>
          <View style={styles.answersCount}>
            <Feather name="message-square" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.answersCountText, { color: themeColors.textSecondary }]}>
              {item.answers?.length || 0} {item.answers?.length === 1 ? 'answer' : 'answers'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.answerButton, { backgroundColor: `${COLORS.primary}15` }]}
            onPress={() => {
              setSelectedQuestion(item);
              setAnswerModalVisible(true);
            }}
          >
            <Feather name="edit" size={16} color={COLORS.primary} />
            <Text style={[styles.answerButtonText, { color: COLORS.primary }]}>Answer</Text>
          </TouchableOpacity>
        </View>

        {/* Show answers */}
        {sortedAnswers.length > 0 && (
          <View style={[styles.answersSection, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.answersSectionTitle, { color: themeColors.text }]}>
              Answers ({sortedAnswers.length})
            </Text>
            {sortedAnswers.map((answer) => {
              const isAccepted = answer.id === item.acceptedAnswerId;
              const userUpvoted = answer.upvotes?.includes(userData.uid);
              const userDownvoted = answer.downvotes?.includes(userData.uid);

              return (
                <View
                  key={answer.id}
                  style={[
                    styles.answerItem,
                    isAccepted && { borderColor: COLORS.accent, borderWidth: 2, borderRadius: SIZES.radius, padding: 12 }
                  ]}
                >
                  {isAccepted && (
                    <View style={[styles.acceptedBadge, { backgroundColor: `${COLORS.accent}15` }]}>
                      <Feather name="check-circle" size={14} color={COLORS.accent} />
                      <Text style={[styles.acceptedText, { color: COLORS.accent }]}>Accepted Answer</Text>
                    </View>
                  )}
                  
                  <View style={styles.answerHeader}>
                    <Text style={[styles.answerUser, { color: COLORS.primary }]}>
                      {answer.userName}
                    </Text>
                    <Text style={[styles.answerTime, { color: themeColors.textSecondary }]}>
                      {formatDate(answer.timestamp)}
                    </Text>
                  </View>
                  
                  <Text style={[styles.answerText, { color: themeColors.text }]}>{answer.text}</Text>
                  
                  <View style={styles.answerActions}>
                    <View style={styles.voteContainer}>
                      <TouchableOpacity
                        style={[styles.voteButton, userUpvoted && { backgroundColor: `${COLORS.accent}15` }]}
                        onPress={() => handleVoteAnswer(item.id, answer.id, 'up')}
                      >
                        <Feather
                          name="arrow-up"
                          size={18}
                          color={userUpvoted ? COLORS.accent : themeColors.textSecondary}
                        />
                        <Text style={[styles.voteCount, { color: userUpvoted ? COLORS.accent : themeColors.textSecondary }]}>
                          {answer.upvotes?.length || 0}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.voteButton, userDownvoted && { backgroundColor: `${COLORS.error}15` }]}
                        onPress={() => handleVoteAnswer(item.id, answer.id, 'down')}
                      >
                        <Feather
                          name="arrow-down"
                          size={18}
                          color={userDownvoted ? COLORS.error : themeColors.textSecondary}
                        />
                        <Text style={[styles.voteCount, { color: userDownvoted ? COLORS.error : themeColors.textSecondary }]}>
                          {answer.downvotes?.length || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    {item.askedBy === userData.uid && !isAccepted && (
                      <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: `${COLORS.accent}15` }]}
                        onPress={() => handleAcceptAnswer(item.id, answer.id)}
                      >
                        <Feather name="check" size={16} color={COLORS.accent} />
                        <Text style={[styles.acceptButtonText, { color: COLORS.accent }]}>
                          Accept
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderChatTab = () => (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={group?.messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-circle" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No messages yet
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Start the conversation!
            </Text>
          </View>
        }
      />
      <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Feather name="x" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.cameraButton} onPress={handleImageAction}>
            <Feather name="camera" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TextInput
            style={[styles.messageInput, { backgroundColor: themeColors.background, color: themeColors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Feather name="send" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderMaterialsTab = () => {
    const filteredMaterials = getFilteredAndSortedMaterials();

    return (
      <View style={styles.tabContainer}>
        {/* Search and Filters */}
        <View style={[styles.searchFilterContainer, { backgroundColor: themeColors.card }]}>
          <View style={[styles.searchBar, { backgroundColor: themeColors.background }]}>
            <Feather name="search" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search materials..."
              placeholderTextColor={themeColors.textSecondary}
              value={materialSearchQuery}
              onChangeText={setMaterialSearchQuery}
            />
            {materialSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setMaterialSearchQuery('')}>
                <Feather name="x" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: themeColors.text }]}>Sort:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsScroll}>
              <TouchableOpacity
                style={[styles.filterChip, materialSortBy === 'newest' && { backgroundColor: COLORS.primary }]}
                onPress={() => setMaterialSortBy('newest')}
              >
                <Text style={[styles.filterChipText, { color: materialSortBy === 'newest' ? '#FFFFFF' : themeColors.text }]}>
                  Newest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, materialSortBy === 'most-viewed' && { backgroundColor: COLORS.primary }]}
                onPress={() => setMaterialSortBy('most-viewed')}
              >
                <Text style={[styles.filterChipText, { color: materialSortBy === 'most-viewed' ? '#FFFFFF' : themeColors.text }]}>
                  Most Viewed
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, materialSortBy === 'highest-rated' && { backgroundColor: COLORS.primary }]}
                onPress={() => setMaterialSortBy('highest-rated')}
              >
                <Text style={[styles.filterChipText, { color: materialSortBy === 'highest-rated' ? '#FFFFFF' : themeColors.text }]}>
                  Highest Rated
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: themeColors.text }]}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsScroll}>
              <TouchableOpacity
                style={[styles.filterChip, materialFilterCategory === 'all' && { backgroundColor: COLORS.primary }]}
                onPress={() => setMaterialFilterCategory('all')}
              >
                <Text style={[styles.filterChipText, { color: materialFilterCategory === 'all' ? '#FFFFFF' : themeColors.text }]}>
                  All
                </Text>
              </TouchableOpacity>
              {MATERIAL_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, materialFilterCategory === cat && { backgroundColor: COLORS.primary }]}
                  onPress={() => setMaterialFilterCategory(cat)}
                >
                  <Text style={[styles.filterChipText, { color: materialFilterCategory === cat ? '#FFFFFF' : themeColors.text }]}>
                    {cat.replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <FlatList
          data={filteredMaterials}
          renderItem={renderMaterial}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.materialsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="folder" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyText, { color: themeColors.text }]}>
                {materialSearchQuery ? 'No materials found' : 'No materials yet'}
              </Text>
              <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
                {materialSearchQuery ? 'Try adjusting your search or filters' : 'Share study materials with the group'}
              </Text>
            </View>
          }
        />
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: COLORS.primary }]}
          onPress={() => setMaterialModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuestionsTab = () => {
    const filteredQuestions = getFilteredAndSortedQuestions();

    return (
      <View style={styles.tabContainer}>
        {/* Search and Filters */}
        <View style={[styles.searchFilterContainer, { backgroundColor: themeColors.card }]}>
          <View style={[styles.searchBar, { backgroundColor: themeColors.background }]}>
            <Feather name="search" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search questions..."
              placeholderTextColor={themeColors.textSecondary}
              value={questionSearchQuery}
              onChangeText={setQuestionSearchQuery}
            />
            {questionSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setQuestionSearchQuery('')}>
                <Feather name="x" size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: themeColors.text }]}>Sort:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsScroll}>
              <TouchableOpacity
                style={[styles.filterChip, questionSortBy === 'newest' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionSortBy('newest')}
              >
                <Text style={[styles.filterChipText, { color: questionSortBy === 'newest' ? '#FFFFFF' : themeColors.text }]}>
                  Newest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, questionSortBy === 'most-answered' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionSortBy('most-answered')}
              >
                <Text style={[styles.filterChipText, { color: questionSortBy === 'most-answered' ? '#FFFFFF' : themeColors.text }]}>
                  Most Answered
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, questionSortBy === 'unanswered' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionSortBy('unanswered')}
              >
                <Text style={[styles.filterChipText, { color: questionSortBy === 'unanswered' ? '#FFFFFF' : themeColors.text }]}>
                  Unanswered
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.filtersRow}>
            <Text style={[styles.filterLabel, { color: themeColors.text }]}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsScroll}>
              <TouchableOpacity
                style={[styles.filterChip, questionFilterStatus === 'all' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionFilterStatus('all')}
              >
                <Text style={[styles.filterChipText, { color: questionFilterStatus === 'all' ? '#FFFFFF' : themeColors.text }]}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, questionFilterStatus === 'open' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionFilterStatus('open')}
              >
                <Text style={[styles.filterChipText, { color: questionFilterStatus === 'open' ? '#FFFFFF' : themeColors.text }]}>
                  Open
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, questionFilterStatus === 'answered' && { backgroundColor: COLORS.secondary }]}
                onPress={() => setQuestionFilterStatus('answered')}
              >
                <Text style={[styles.filterChipText, { color: questionFilterStatus === 'answered' ? '#FFFFFF' : themeColors.text }]}>
                  Answered
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        <FlatList
          data={filteredQuestions}
          renderItem={renderQuestion}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.questionsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="help-circle" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyText, { color: themeColors.text }]}>
                {questionSearchQuery ? 'No questions found' : 'No questions yet'}
              </Text>
              <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
                {questionSearchQuery ? 'Try adjusting your search or filters' : 'Ask a question to get help from the group'}
              </Text>
            </View>
          }
        />
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: COLORS.secondary }]}
          onPress={() => setQuestionModalVisible(true)}
        >
          <Feather name="help-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  if (!group) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Feather name="message-circle" size={20} color={activeTab === 'chat' ? COLORS.primary : themeColors.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'chat' ? COLORS.primary : themeColors.textSecondary }]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.activeTab]}
          onPress={() => setActiveTab('materials')}
        >
          <Feather name="folder" size={20} color={activeTab === 'materials' ? COLORS.primary : themeColors.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'materials' ? COLORS.primary : themeColors.textSecondary }]}>
            Materials
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
          onPress={() => setActiveTab('questions')}
        >
          <Feather name="help-circle" size={20} color={activeTab === 'questions' ? COLORS.primary : themeColors.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'questions' ? COLORS.primary : themeColors.textSecondary }]}>
            Q&A
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'chat' && renderChatTab()}
      {activeTab === 'materials' && renderMaterialsTab()}
      {activeTab === 'questions' && renderQuestionsTab()}

      {/* Add Material Modal */}
      <Modal
        visible={materialModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMaterialModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Add Study Material</Text>
            <TouchableOpacity onPress={() => setMaterialModalVisible(false)}>
              <Feather name="x" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Enter material title"
                placeholderTextColor={themeColors.textSecondary}
                value={materialTitle}
                onChangeText={setMaterialTitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {MATERIAL_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: themeColors.card, borderColor: themeColors.border },
                      materialCategory === cat && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                    ]}
                    onPress={() => setMaterialCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      { color: themeColors.text },
                      materialCategory === cat && { color: '#FFFFFF' }
                    ]}>
                      {cat.replace('-', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Describe the material"
                placeholderTextColor={themeColors.textSecondary}
                value={materialDescription}
                onChangeText={setMaterialDescription}
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>URL/Link (Optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="https://..."
                placeholderTextColor={themeColors.textSecondary}
                value={materialUrl}
                onChangeText={setMaterialUrl}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Upload File</Text>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                onPress={handlePickDocument}
              >
                <Feather name="upload" size={20} color={COLORS.primary} />
                <Text style={[styles.uploadButtonText, { color: COLORS.primary }]}>
                  {materialFile ? materialFile.name : 'Choose file from device'}
                </Text>
              </TouchableOpacity>
              {materialFile && (
                <View style={[styles.filePreview, { backgroundColor: themeColors.background }]}>
                  <Feather name="file" size={16} color={COLORS.primary} />
                  <Text style={[styles.filePreviewText, { color: themeColors.text }]}>
                    {materialFile.name}
                  </Text>
                  <TouchableOpacity onPress={() => setMaterialFile(null)}>
                    <Feather name="x" size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: COLORS.primary }]}
              onPress={handleAddMaterial}
            >
              <Text style={styles.submitButtonText}>Add Material</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Ask Question Modal */}
      <Modal
        visible={questionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setQuestionModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Ask a Question</Text>
            <TouchableOpacity onPress={() => setQuestionModalVisible(false)}>
              <Feather name="x" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Question *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="What's your question?"
                placeholderTextColor={themeColors.textSecondary}
                value={questionTitle}
                onChangeText={setQuestionTitle}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Details</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Provide more details (optional)"
                placeholderTextColor={themeColors.textSecondary}
                value={questionDescription}
                onChangeText={setQuestionDescription}
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Tags (Optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {QUESTION_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: themeColors.card, borderColor: themeColors.border },
                      questionTags.includes(tag) && { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }
                    ]}
                    onPress={() => {
                      if (questionTags.includes(tag)) {
                        setQuestionTags(questionTags.filter(t => t !== tag));
                      } else {
                        setQuestionTags([...questionTags, tag]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      { color: themeColors.text },
                      questionTags.includes(tag) && { color: '#FFFFFF' }
                    ]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: COLORS.secondary }]}
              onPress={handleAskQuestion}
            >
              <Text style={styles.submitButtonText}>Post Question</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Answer Modal */}
      <Modal
        visible={answerModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAnswerModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Answer Question</Text>
            <TouchableOpacity onPress={() => setAnswerModalVisible(false)}>
              <Feather name="x" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedQuestion && (
              <View style={styles.questionPreview}>
                <Text style={[styles.questionPreviewTitle, { color: themeColors.text }]}>
                  {selectedQuestion.title}
                </Text>
                {selectedQuestion.description && (
                  <Text style={[styles.questionPreviewDesc, { color: themeColors.textSecondary }]}>
                    {selectedQuestion.description}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Your Answer *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Type your answer here..."
                placeholderTextColor={themeColors.textSecondary}
                value={answerText}
                onChangeText={setAnswerText}
                multiline
                numberOfLines={6}
              />
            </View>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: COLORS.primary }]}
              onPress={handleSubmitAnswer}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Full Screen Image Modal */}
      <Modal
        visible={!!fullScreenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.fullScreenClose}
            onPress={() => setFullScreenImage(null)}
          >
            <Feather name="x" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          {fullScreenImage && (
            <Image
              source={{ uri: fullScreenImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: { fontSize: SIZES.body, fontWeight: '600' },
  tabContainer: { flex: 1 },
  chatContainer: { flex: 1 },
  messagesList: { padding: SIZES.padding },
  messageWrapper: {
    marginBottom: 16,
    alignItems: 'flex-start',
    width: '100%',
  },
  messageWrapperOwn: {
    alignItems: 'flex-end',
  },
  messageTouchable: {
    maxWidth: '75%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: SIZES.radius,
  },
  messageSender: { fontSize: SIZES.caption, fontWeight: '600', marginBottom: 4 },
  messageText: { fontSize: SIZES.body, lineHeight: 20 },
  messageFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
  messageTime: { fontSize: SIZES.caption - 2 },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: SIZES.radius,
    marginBottom: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    maxWidth: '75%',
  },
  reactionsContainerOwn: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { fontSize: SIZES.caption - 1, fontWeight: '600' },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginTop: 8,
    maxWidth: '85%',
    ...SHADOWS.light,
  },
  emojiPickerOwn: {
    alignSelf: 'flex-end',
  },
  emojiOption: {
    padding: 6,
  },
  emojiOptionText: { fontSize: 24 },
  inputContainer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
  },
  imagePreviewContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: SIZES.body,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialsList: { padding: SIZES.padding },
  materialCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  materialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  materialInfo: { flex: 1, marginLeft: 12 },
  materialTitle: { fontSize: SIZES.h6, fontWeight: 'bold', marginBottom: 4 },
  materialUploader: { fontSize: SIZES.caption },
  materialDescription: { fontSize: SIZES.body, marginBottom: 12, lineHeight: 20 },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 12,
  },
  fileName: { flex: 1, fontSize: SIZES.body, fontWeight: '500' },
  fileSize: { fontSize: SIZES.caption },
  materialLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  materialLinkText: { fontSize: SIZES.body, fontWeight: '600' },
  questionsList: { padding: SIZES.padding },
  questionCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  questionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  questionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionInfo: { flex: 1 },
  questionTitle: { fontSize: SIZES.h6, fontWeight: 'bold', marginBottom: 4 },
  questionAsker: { fontSize: SIZES.caption },
  questionDescription: { fontSize: SIZES.body, marginBottom: 12, lineHeight: 20 },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answersCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answersCountText: { fontSize: SIZES.caption },
  answerButton: { padding: 8 },
  answerButtonText: { fontSize: SIZES.body, fontWeight: '600' },
  answersSection: {
    marginTop: 12,
    padding: 12,
    borderRadius: SIZES.radius,
  },
  answerItem: { marginBottom: 16, paddingVertical: 8 },
  answerUser: { fontSize: SIZES.caption, fontWeight: 'bold', marginBottom: 4 },
  answerText: { fontSize: SIZES.body, lineHeight: 20, marginBottom: 4 },
  answerTime: { fontSize: SIZES.caption - 2 },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: SIZES.h6, marginTop: 16, fontWeight: '600' },
  emptySubtext: { fontSize: SIZES.body, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  errorText: { fontSize: SIZES.h5, textAlign: 'center', marginTop: 40 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: SIZES.h4, fontWeight: 'bold' },
  modalContent: { flex: 1, padding: SIZES.padding },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: SIZES.body, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: SIZES.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: SIZES.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  uploadButtonText: { fontSize: SIZES.body, fontWeight: '500' },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: SIZES.radius,
    marginTop: 12,
  },
  filePreviewText: { flex: 1, fontSize: SIZES.body },
  submitButton: {
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: SIZES.h6, fontWeight: 'bold' },
  questionPreview: {
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  questionPreviewTitle: { fontSize: SIZES.h6, fontWeight: 'bold', marginBottom: 4 },
  questionPreviewDesc: { fontSize: SIZES.body },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  // Search and Filter Styles
  searchFilterContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body,
  },
  filtersScroll: {
    marginTop: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterChipsScroll: {
    flex: 1,
    flexDirection: 'row',
  },
  filterLabel: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 70,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: SIZES.body - 2,
    fontWeight: '500',
  },
  // Enhanced Material Styles
  pinnedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  pinnedText: {
    fontSize: SIZES.body - 4,
    fontWeight: '600',
  },
  materialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  materialDot: {
    fontSize: SIZES.body - 2,
  },
  materialDate: {
    fontSize: SIZES.body - 2,
  },
  pinButton: {
    padding: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: SIZES.body - 4,
    fontWeight: '600',
  },
  materialStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: SIZES.body - 2,
  },
  ratingSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  ratingLabel: {
    fontSize: SIZES.body - 1,
    fontWeight: '500',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 2,
  },
  // Enhanced Q&A Styles
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  questionDate: {
    fontSize: SIZES.body - 2,
  },
  questionTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: SIZES.body - 4,
    fontWeight: '600',
  },
  answersSectionTitle: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  acceptedText: {
    fontSize: SIZES.body - 4,
    fontWeight: '600',
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  voteCount: {
    fontSize: SIZES.body - 1,
    fontWeight: '600',
  },
  voteScore: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  acceptButtonText: {
    fontSize: SIZES.body - 2,
    fontWeight: '600',
  },
  // Category/Tag Selection in Modals
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: SIZES.body - 1,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default GroupChatScreen;
