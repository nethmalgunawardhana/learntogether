import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDY_GROUPS_KEY = '@study_groups';

// Async thunks
export const loadStudyGroups = createAsyncThunk(
  'studyGroups/loadStudyGroups',
  async (_, { rejectWithValue }) => {
    try {
      const groupsStr = await AsyncStorage.getItem(STUDY_GROUPS_KEY);
      return groupsStr ? JSON.parse(groupsStr) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStudyGroup = createAsyncThunk(
  'studyGroups/createStudyGroup',
  async (groupData, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const newGroup = {
        id: Date.now().toString(),
        ...groupData,
        createdAt: new Date().toISOString(),
        members: groupData.members || [],
        messages: [],
        materials: [],
        questions: [],
      };
      const updatedGroups = [...studyGroups, newGroup];
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return newGroup;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageToGroup = createAsyncThunk(
  'studyGroups/addMessage',
  async ({ groupId, message }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            messages: [...(group.messages || []), message],
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMaterialToGroup = createAsyncThunk(
  'studyGroups/addMaterial',
  async ({ groupId, material }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            materials: [...(group.materials || []), material],
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, material };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addQuestionToGroup = createAsyncThunk(
  'studyGroups/addQuestion',
  async ({ groupId, question }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            questions: [...(group.questions || []), question],
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, question };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAnswerToQuestion = createAsyncThunk(
  'studyGroups/addAnswer',
  async ({ groupId, questionId, answer }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            questions: (group.questions || []).map(q => {
              if (q.id === questionId) {
                return {
                  ...q,
                  answers: [...(q.answers || []), answer],
                };
              }
              return q;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, questionId, answer };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReactionToMessage = createAsyncThunk(
  'studyGroups/addReaction',
  async ({ groupId, messageId, emoji, userId }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            messages: (group.messages || []).map(msg => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || {};
                const emojiReactions = reactions[emoji] || [];

                // Toggle reaction: if user already reacted with this emoji, remove it; otherwise add it
                const hasReacted = emojiReactions.includes(userId);
                const updatedEmojiReactions = hasReacted
                  ? emojiReactions.filter(id => id !== userId)
                  : [...emojiReactions, userId];

                // Remove emoji key if no reactions left
                const updatedReactions = { ...reactions };
                if (updatedEmojiReactions.length === 0) {
                  delete updatedReactions[emoji];
                } else {
                  updatedReactions[emoji] = updatedEmojiReactions;
                }

                return {
                  ...msg,
                  reactions: updatedReactions,
                };
              }
              return msg;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, messageId, emoji, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  studyGroups: [],
  loading: false,
  error: null,
};

// Study groups slice
const studyGroupsSlice = createSlice({
  name: 'studyGroups',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load study groups
      .addCase(loadStudyGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStudyGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.studyGroups = action.payload;
        state.error = null;
      })
      .addCase(loadStudyGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create study group
      .addCase(createStudyGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudyGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.studyGroups.push(action.payload);
        state.error = null;
      })
      .addCase(createStudyGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add message to group
      .addCase(addMessageToGroup.fulfilled, (state, action) => {
        const { groupId, message } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          group.messages = [...(group.messages || []), message];
        }
      })
      // Add material to group
      .addCase(addMaterialToGroup.fulfilled, (state, action) => {
        const { groupId, material } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          group.materials = [...(group.materials || []), material];
        }
      })
      // Add question to group
      .addCase(addQuestionToGroup.fulfilled, (state, action) => {
        const { groupId, question } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          group.questions = [...(group.questions || []), question];
        }
      })
      // Add answer to question
      .addCase(addAnswerToQuestion.fulfilled, (state, action) => {
        const { groupId, questionId, answer } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const question = group.questions?.find(q => q.id === questionId);
          if (question) {
            question.answers = [...(question.answers || []), answer];
          }
        }
      })
      // Add reaction to message
      .addCase(addReactionToMessage.fulfilled, (state, action) => {
        const { groupId, messageId, emoji, userId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const message = group.messages?.find(m => m.id === messageId);
          if (message) {
            const reactions = message.reactions || {};
            const emojiReactions = reactions[emoji] || [];
            const hasReacted = emojiReactions.includes(userId);
            const updatedEmojiReactions = hasReacted
              ? emojiReactions.filter(id => id !== userId)
              : [...emojiReactions, userId];

            if (updatedEmojiReactions.length === 0) {
              delete reactions[emoji];
            } else {
              reactions[emoji] = updatedEmojiReactions;
            }
            message.reactions = reactions;
          }
        }
      });
  },
});

export const { clearError } = studyGroupsSlice.actions;

// Selectors
export const selectGroupById = (groupId) => (state) =>
  state.studyGroups.studyGroups.find(group => group.id === groupId);

export default studyGroupsSlice.reducer;
