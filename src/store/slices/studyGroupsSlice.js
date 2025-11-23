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

// Material enhancements
export const rateMaterial = createAsyncThunk(
  'studyGroups/rateMaterial',
  async ({ groupId, materialId, rating, userId }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            materials: (group.materials || []).map(mat => {
              if (mat.id === materialId) {
                const ratings = mat.ratings || {};
                ratings[userId] = rating;
                const ratingsArray = Object.values(ratings);
                const averageRating = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;
                return { ...mat, ratings, averageRating, totalRatings: ratingsArray.length };
              }
              return mat;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, materialId, rating, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const incrementMaterialView = createAsyncThunk(
  'studyGroups/incrementMaterialView',
  async ({ groupId, materialId }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            materials: (group.materials || []).map(mat => {
              if (mat.id === materialId) {
                return { ...mat, views: (mat.views || 0) + 1 };
              }
              return mat;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, materialId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePinMaterial = createAsyncThunk(
  'studyGroups/togglePinMaterial',
  async ({ groupId, materialId }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            materials: (group.materials || []).map(mat => {
              if (mat.id === materialId) {
                return { ...mat, pinned: !mat.pinned };
              }
              return mat;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, materialId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Q&A enhancements
export const voteAnswer = createAsyncThunk(
  'studyGroups/voteAnswer',
  async ({ groupId, questionId, answerId, voteType, userId }, { getState, rejectWithValue }) => {
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
                  answers: (q.answers || []).map(ans => {
                    if (ans.id === answerId) {
                      const upvotes = ans.upvotes || [];
                      const downvotes = ans.downvotes || [];
                      
                      let newUpvotes = [...upvotes];
                      let newDownvotes = [...downvotes];

                      if (voteType === 'up') {
                        if (upvotes.includes(userId)) {
                          newUpvotes = upvotes.filter(id => id !== userId);
                        } else {
                          newUpvotes = [...upvotes, userId];
                          newDownvotes = downvotes.filter(id => id !== userId);
                        }
                      } else if (voteType === 'down') {
                        if (downvotes.includes(userId)) {
                          newDownvotes = downvotes.filter(id => id !== userId);
                        } else {
                          newDownvotes = [...downvotes, userId];
                          newUpvotes = upvotes.filter(id => id !== userId);
                        }
                      }

                      return {
                        ...ans,
                        upvotes: newUpvotes,
                        downvotes: newDownvotes,
                        score: newUpvotes.length - newDownvotes.length
                      };
                    }
                    return ans;
                  }),
                };
              }
              return q;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, questionId, answerId, voteType, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAnswerAsAccepted = createAsyncThunk(
  'studyGroups/markAnswerAsAccepted',
  async ({ groupId, questionId, answerId }, { getState, rejectWithValue }) => {
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
                  acceptedAnswerId: q.acceptedAnswerId === answerId ? null : answerId,
                  status: q.acceptedAnswerId === answerId ? 'open' : 'answered',
                };
              }
              return q;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, questionId, answerId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestionStatus = createAsyncThunk(
  'studyGroups/updateQuestionStatus',
  async ({ groupId, questionId, status }, { getState, rejectWithValue }) => {
    try {
      const { studyGroups } = getState().studyGroups;
      const updatedGroups = studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            questions: (group.questions || []).map(q => {
              if (q.id === questionId) {
                return { ...q, status };
              }
              return q;
            }),
          };
        }
        return group;
      });
      await AsyncStorage.setItem(STUDY_GROUPS_KEY, JSON.stringify(updatedGroups));
      return { groupId, questionId, status };
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
      })
      // Rate material
      .addCase(rateMaterial.fulfilled, (state, action) => {
        const { groupId, materialId, rating, userId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const material = group.materials?.find(m => m.id === materialId);
          if (material) {
            const ratings = material.ratings || {};
            ratings[userId] = rating;
            const ratingsArray = Object.values(ratings);
            const averageRating = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;
            material.ratings = ratings;
            material.averageRating = averageRating;
            material.totalRatings = ratingsArray.length;
          }
        }
      })
      // Increment material view
      .addCase(incrementMaterialView.fulfilled, (state, action) => {
        const { groupId, materialId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const material = group.materials?.find(m => m.id === materialId);
          if (material) {
            material.views = (material.views || 0) + 1;
          }
        }
      })
      // Toggle pin material
      .addCase(togglePinMaterial.fulfilled, (state, action) => {
        const { groupId, materialId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const material = group.materials?.find(m => m.id === materialId);
          if (material) {
            material.pinned = !material.pinned;
          }
        }
      })
      // Vote answer
      .addCase(voteAnswer.fulfilled, (state, action) => {
        const { groupId, questionId, answerId, voteType, userId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const question = group.questions?.find(q => q.id === questionId);
          if (question) {
            const answer = question.answers?.find(a => a.id === answerId);
            if (answer) {
              const upvotes = answer.upvotes || [];
              const downvotes = answer.downvotes || [];
              
              let newUpvotes = [...upvotes];
              let newDownvotes = [...downvotes];

              if (voteType === 'up') {
                if (upvotes.includes(userId)) {
                  newUpvotes = upvotes.filter(id => id !== userId);
                } else {
                  newUpvotes = [...upvotes, userId];
                  newDownvotes = downvotes.filter(id => id !== userId);
                }
              } else if (voteType === 'down') {
                if (downvotes.includes(userId)) {
                  newDownvotes = downvotes.filter(id => id !== userId);
                } else {
                  newDownvotes = [...downvotes, userId];
                  newUpvotes = upvotes.filter(id => id !== userId);
                }
              }

              answer.upvotes = newUpvotes;
              answer.downvotes = newDownvotes;
              answer.score = newUpvotes.length - newDownvotes.length;
            }
          }
        }
      })
      // Mark answer as accepted
      .addCase(markAnswerAsAccepted.fulfilled, (state, action) => {
        const { groupId, questionId, answerId } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const question = group.questions?.find(q => q.id === questionId);
          if (question) {
            question.acceptedAnswerId = question.acceptedAnswerId === answerId ? null : answerId;
            question.status = question.acceptedAnswerId === answerId ? 'open' : 'answered';
          }
        }
      })
      // Update question status
      .addCase(updateQuestionStatus.fulfilled, (state, action) => {
        const { groupId, questionId, status } = action.payload;
        const group = state.studyGroups.find(g => g.id === groupId);
        if (group) {
          const question = group.questions?.find(q => q.id === questionId);
          if (question) {
            question.status = status;
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
