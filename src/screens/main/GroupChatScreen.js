import React, { useState } from 'react';
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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import {
  addMessageToGroup,
  addMaterialToGroup,
  addQuestionToGroup,
  addAnswerToQuestion,
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
  const [materialModalVisible, setMaterialModalVisible] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      userId: userData.uid,
      userName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessageToGroup({ groupId, message }));
    setMessageText('');
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
      uploadedBy: userData.uid,
      uploaderName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
    };

    dispatch(addMaterialToGroup({ groupId, material }));
    setMaterialModalVisible(false);
    setMaterialTitle('');
    setMaterialDescription('');
    setMaterialUrl('');
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
      askedBy: userData.uid,
      askerName: userData.displayName || 'User',
      timestamp: new Date().toISOString(),
      answers: [],
    };

    dispatch(addQuestionToGroup({ groupId, question }));
    setQuestionModalVisible(false);
    setQuestionTitle('');
    setQuestionDescription('');
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
    };

    dispatch(addAnswerToQuestion({ groupId, questionId: selectedQuestion.id, answer }));
    setAnswerModalVisible(false);
    setAnswerText('');
    setSelectedQuestion(null);
    Alert.alert('Success', 'Answer submitted!');
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === userData.uid;
    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
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
          <Text style={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : themeColors.text }]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : themeColors.textSecondary }]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  const renderMaterial = ({ item }) => (
    <View style={[styles.materialCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <View style={styles.materialHeader}>
        <Feather name="file-text" size={24} color={COLORS.primary} />
        <View style={styles.materialInfo}>
          <Text style={[styles.materialTitle, { color: themeColors.text }]}>{item.title}</Text>
          <Text style={[styles.materialUploader, { color: themeColors.textSecondary }]}>
            by {item.uploaderName} • {formatDate(item.timestamp)}
          </Text>
        </View>
      </View>
      {item.description && (
        <Text style={[styles.materialDescription, { color: themeColors.textSecondary }]}>
          {item.description}
        </Text>
      )}
      {item.url && (
        <TouchableOpacity style={styles.materialLink}>
          <Feather name="link" size={16} color={COLORS.primary} />
          <Text style={[styles.materialLinkText, { color: COLORS.primary }]}>View Material</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderQuestion = ({ item }) => (
    <View style={[styles.questionCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <View style={styles.questionHeader}>
        <View style={[styles.questionIcon, { backgroundColor: `${COLORS.secondary}15` }]}>
          <Feather name="help-circle" size={20} color={COLORS.secondary} />
        </View>
        <View style={styles.questionInfo}>
          <Text style={[styles.questionTitle, { color: themeColors.text }]}>{item.title}</Text>
          <Text style={[styles.questionAsker, { color: themeColors.textSecondary }]}>
            by {item.askerName} • {formatDate(item.timestamp)}
          </Text>
        </View>
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
          style={styles.answerButton}
          onPress={() => {
            setSelectedQuestion(item);
            setAnswerModalVisible(true);
          }}
        >
          <Text style={[styles.answerButtonText, { color: COLORS.primary }]}>Answer</Text>
        </TouchableOpacity>
      </View>
      {/* Show answers */}
      {item.answers && item.answers.length > 0 && (
        <View style={[styles.answersSection, { backgroundColor: themeColors.background }]}>
          {item.answers.map((answer) => (
            <View key={answer.id} style={styles.answerItem}>
              <Text style={[styles.answerUser, { color: COLORS.primary }]}>
                {answer.userName}
              </Text>
              <Text style={[styles.answerText, { color: themeColors.text }]}>{answer.text}</Text>
              <Text style={[styles.answerTime, { color: themeColors.textSecondary }]}>
                {formatDate(answer.timestamp)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderChatTab = () => (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={group?.messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
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
    </KeyboardAvoidingView>
  );

  const renderMaterialsTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={group?.materials || []}
        renderItem={renderMaterial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.materialsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="folder" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No materials yet
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Share study materials with the group
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

  const renderQuestionsTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={group?.questions || []}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.questionsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="help-circle" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No questions yet
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Ask a question to get help from the group
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
              <Text style={[styles.label, { color: themeColors.text }]}>URL/Link</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="https://..."
                placeholderTextColor={themeColors.textSecondary}
                value={materialUrl}
                onChangeText={setMaterialUrl}
              />
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
  messageContainer: { marginBottom: 12 },
  ownMessage: { alignItems: 'flex-end' },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: SIZES.radius,
  },
  messageSender: { fontSize: SIZES.caption, fontWeight: '600', marginBottom: 4 },
  messageText: { fontSize: SIZES.body, lineHeight: 20 },
  messageTime: { fontSize: SIZES.caption - 2, marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SIZES.padding,
    borderTopWidth: 1,
    gap: 12,
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
  answerItem: { marginBottom: 12 },
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
});

export default GroupChatScreen;
