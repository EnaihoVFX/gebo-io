import React, { useState } from 'react';
import { User, Mail, AtSign, Sparkles } from 'lucide-react';

enum OnboardingStep {
  GenderAgeName = 0,
  Email = 1,
  Username = 2,
  Complete = 3,
}

const TOTAL_STEPS = 3;

const Onboarding: React.FC<{ onOnboardingComplete?: () => void }> = ({ onOnboardingComplete = () => window.location.href = '/' }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.GenderAgeName);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<{ email?: string; username?: string }>({});

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    // Simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email address';
    return '';
  };

  const validateUsername = (username: string) => {
    if (!username) return 'Username is required';
    if (!/^@?\w{3,20}$/.test(username)) return 'Username must be 3-20 characters, letters/numbers/underscores';
    return '';
  };

  const handleNext = () => {
    if (currentStep === OnboardingStep.Email) {
      const emailError = validateEmail(email);
      if (emailError) {
        setErrors({ ...errors, email: emailError });
        return;
      }
      setErrors({ ...errors, email: undefined });
    }
    if (currentStep === OnboardingStep.Username) {
      const usernameError = validateUsername(username);
      if (usernameError) {
        setErrors({ ...errors, username: usernameError });
        return;
      }
      setErrors({ ...errors, username: undefined });
    }
    setCurrentStep((prev) => (prev + 1) as OnboardingStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev - 1) as OnboardingStep);
  };

  const handleSkip = () => {
    setGender('');
    setAge('');
    setFullName('');
    setCurrentStep(OnboardingStep.Email);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.GenderAgeName:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(255, 20, 147, 0.2) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(138, 43, 226, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset'
              }}>
                <User style={{ width: '32px', height: '32px', color: '#fff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>Tell Us About Yourself</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>This information is optional and helps us personalize your experience</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 255, 255, 0.1) inset'
                  }}
                >
                  <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>Select your gender</option>
                  <option value="male" style={{ background: '#1a1a1a', color: '#fff' }}>Male</option>
                  <option value="female" style={{ background: '#1a1a1a', color: '#fff' }}>Female</option>
                  <option value="other" style={{ background: '#1a1a1a', color: '#fff' }}>Other</option>
                  <option value="prefer-not-say" style={{ background: '#1a1a1a', color: '#fff' }}>Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Age</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 255, 255, 0.1) inset'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 255, 255, 0.1) inset'
                  }}
                />
              </div>
            </div>
          </div>
        );
      case OnboardingStep.Email:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 191, 255, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset'
              }}>
                <Mail style={{ width: '32px', height: '32px', color: '#fff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>Provide Your Email</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>We'll use this to send you important updates and notifications</p>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600'
              }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(25px)',
                  border: `1px solid ${errors.email ? 'rgba(255, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 255, 255, 0.1) inset ${errors.email ? ', 0 0 20px rgba(255, 68, 68, 0.2)' : ''}`
                }}
              />
              {errors.email && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#ff4444',
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: '0 0 8px rgba(255, 68, 68, 0.5)'
                }}>
                  <span style={{ marginRight: '4px' }}>⚠</span>
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        );
      case OnboardingStep.Username:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 20, 147, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 20, 147, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset'
              }}>
                <AtSign style={{ width: '32px', height: '32px', color: '#fff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' }} />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>Choose a Username</h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>This will be your unique identifier on the platform</p>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600'
              }}>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(25px)',
                  border: `1px solid ${errors.username ? 'rgba(255, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 255, 255, 0.1) inset ${errors.username ? ', 0 0 20px rgba(255, 68, 68, 0.2)' : ''}`
                }}
              />
              {errors.username && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#ff4444',
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: '0 0 8px rgba(255, 68, 68, 0.5)'
                }}>
                  <span style={{ marginRight: '4px' }}>⚠</span>
                  {errors.username}
                </p>
              )}
            </div>
          </div>
        );
      case OnboardingStep.Complete:
        return (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(50, 205, 50, 0.2) 0%, rgba(0, 191, 255, 0.2) 100%)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(50, 205, 50, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(50, 205, 50, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <Sparkles style={{ width: '40px', height: '40px', color: '#fff', filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' }} />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '16px',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
            }}>Welcome Aboard! 🎉</h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              maxWidth: '400px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Your account has been set up successfully. You're ready to explore and make the most of your experience!
            </p>
            <div style={{ paddingTop: '24px' }}>
              <button 
                onClick={() => {
                  // Save onboarding details to localStorage
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('onboardingDetails', JSON.stringify({
                      gender,
                      age,
                      fullName,
                      email,
                      username
                    }));
                  }
                  onOnboardingComplete();
                }}
                style={{
                  position: 'relative',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, rgba(50, 205, 50, 0.2) 0%, rgba(0, 191, 255, 0.2) 100%)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(50, 205, 50, 0.3)',
                  borderRadius: '24px',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 24px rgba(50, 205, 50, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset',
                  overflow: 'hidden',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(50, 205, 50, 0.3) 0%, rgba(0, 191, 255, 0.3) 100%)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.05)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 16px 40px rgba(50, 205, 50, 0.3), 0 8px 20px rgba(255, 255, 255, 0.15) inset';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(50, 205, 50, 0.2) 0%, rgba(0, 191, 255, 0.2) 100%)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(50, 205, 50, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1) inset';
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showNextButton = currentStep !== OnboardingStep.Complete;
  const showBackButton = currentStep > OnboardingStep.GenderAgeName && currentStep !== OnboardingStep.Complete;
  const showSkipButton = currentStep === OnboardingStep.GenderAgeName;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(138, 43, 226, 0.3) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 191, 255, 0.2) 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        {/* Progress Bar */}
        {currentStep !== OnboardingStep.Complete && (
          <div style={{ marginBottom: '32px', width: '100%' }}>
            <div style={{
              height: '8px',
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(138,43,226,0.08)'
            }}>
              <div style={{
                height: '100%',
                width: `${((currentStep as number) / TOTAL_STEPS) * 100}%`,
                background: 'linear-gradient(90deg, #8a2be2 0%, #00bfff 100%)',
                borderRadius: '8px',
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)'
              }} />
            </div>
          </div>
        )}
        <div style={{
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '32px',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '40px 32px',
          margin: '0 auto',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          {renderStepContent()}
          {/* Navigation Buttons */}
          {currentStep !== OnboardingStep.Complete && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '12px' }}>
              {showBackButton ? (
                <button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginRight: showNextButton ? '8px' : 0
                  }}
                >Back</button>
              ) : <div style={{ flex: 1 }} />}
              {showSkipButton && (
                <button
                  onClick={handleSkip}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    background: 'rgba(0,191,255,0.10)',
                    border: '1px solid rgba(0,191,255,0.18)',
                    borderRadius: '16px',
                    color: '#00bfff',
                    fontWeight: 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    marginRight: showNextButton ? '8px' : 0,
                    transition: 'all 0.2s'
                  }}
                >Skip</button>
              )}
              {showNextButton && (
                <button
                  onClick={handleNext}
                  style={{
                    flex: 2,
                    padding: '12px 0',
                    background: 'linear-gradient(90deg, #8a2be2 0%, #00bfff 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(138,43,226,0.10)',
                    transition: 'all 0.2s'
                  }}
                >Next</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 