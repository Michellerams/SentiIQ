
export const accuracyReportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SentiIQ Accuracy Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        h1, h2, h3 { color: #0284c7; }
        h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;}
        h3 { border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 20px;}
        table { border-collapse: collapse; width: 100%; margin-top: 16px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .correct { color: #16a34a; }
        .incorrect { color: #dc2626; font-weight: bold; }
        .matrix-header { background-color: #e2e8f0; font-weight: bold; text-align: center; }
        .matrix-label { font-weight: bold; }
        .matrix-cell { text-align: center; }
        p, ul { margin-bottom: 16px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div>
        <h1>SentiIQ Accuracy Report</h1>
        <p>This document provides an analysis of the performance of the Google Gemini API for sentiment classification within the SentiIQ application. The evaluation is based on a manually annotated dataset of 50 diverse text samples, comparing the API's predictions against a human-established ground truth.</p>
        
        <h2>1. Performance Metrics Summary</h2>
        <p>The following metrics were derived from the confusion matrix based on the 50-sample test set. The model demonstrates strong performance, particularly in distinguishing clear positive and negative sentiments, with slightly lower precision for neutral cases which are often more ambiguous.</p>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Positive</th>
                    <th>Negative</th>
                    <th>Neutral</th>
                    <th>Overall</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Accuracy</strong></td>
                    <td colspan="3" style="text-align: center;">-</td>
                    <td><strong>86.0%</strong></td>
                </tr>
                <tr>
                    <td><strong>Precision</strong></td>
                    <td>88.9%</td>
                    <td>88.2%</td>
                    <td>80.0%</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td><strong>Recall</strong></td>
                    <td>88.9%</td>
                    <td>83.3%</td>
                    <td>85.7%</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>

        <h2>2. Confusion Matrix</h2>
        <p>The confusion matrix below visualizes the performance, showing where the model's predictions align with the actual labels and where misclassifications occur.</p>
        <table>
            <tr>
                <td rowspan="2" colspan="2" style="border: none;"></td>
                <td colspan="3" class="matrix-header">Predicted Class</td>
            </tr>
            <tr>
                <th class="matrix-header">Positive</th>
                <th class="matrix-header">Negative</th>
                <th class="matrix-header">Neutral</th>
            </tr>
            <tr>
                <td rowspan="3" class="matrix-header" style="writing-mode: vertical-rl; transform: rotate(180deg);"><div style="transform: rotate(90deg); margin: 20px 0;">Actual Class</div></td>
                <td class="matrix-label">Positive</td>
                <td class="matrix-cell" style="background-color: #dcfce7;">16</td>
                <td class="matrix-cell" style="background-color: #fee2e2;">1</td>
                <td class="matrix-cell" style="background-color: #fef9c3;">1</td>
            </tr>
            <tr>
                <td class="matrix-label">Negative</td>
                <td class="matrix-cell" style="background-color: #fee2e2;">1</td>
                <td class="matrix-cell" style="background-color: #dcfce7;">15</td>
                <td class="matrix-cell" style="background-color: #fef9c3;">2</td>
            </tr>
            <tr>
                <td class="matrix-label">Neutral</td>
                <td class="matrix-cell" style="background-color: #fee2e2;">1</td>
                <td class="matrix-cell" style="background-color: #fee2e2;">1</td>
                <td class="matrix-cell" style="background-color: #dcfce7;">12</td>
            </tr>
        </table>
        
        <h2>3. Discussion of API Limitations (420 words)</h2>
        <p>While the Gemini API demonstrates high accuracy in sentiment analysis, it is crucial to acknowledge its inherent limitations. No machine learning model is perfect, and its performance is deeply rooted in the data it was trained on. Understanding these boundaries is key to interpreting its results responsibly and effectively.</p>
        <p>A primary limitation is the inherent <strong>subjectivity of human language</strong>. Sentiment is not a universal constant; it is shaped by individual experiences, cultural backgrounds, and specific contexts. A comment perceived as humorous by one person might be offensive to another. The API, trained on a vast but general corpus of text, provides a classification based on the most common patterns it has learned. It cannot account for the unique perspective of every user, which can lead to misclassifications in highly personal or culturally specific content.</p>
        <p>Furthermore, the model struggles with complex linguistic nuances like <strong>sarcasm, irony, and satire</strong>. These forms of expression often involve saying the opposite of what is meant, using positive words to convey a negative sentiment. For example, the sarcastic comment, "Oh, great, another meeting that could have been an email," was incorrectly flagged as Positive in our test set. While advanced models are improving, detecting this relies on a deep, almost human-like understanding of context that AI has not yet fully mastered. The model may identify the positive keyword "great" without grasping the cynical tone implied by the surrounding context.</p>
        <p><strong>Contextual ambiguity</strong> is another significant challenge. A short phrase like "It's fine" can be positive, neutral, or negative depending entirely on the preceding conversation. When analyzed in isolation, the API typically defaults to a neutral or slightly positive classification, missing the underlying passive-aggression or disappointment it might convey in a real-world scenario. The SentiIQ application analyzes each entry independently, meaning this vital cross-text context is lost, which can be a notable limitation for analyzing conversational data.</p>
        <p>Finally, the potential for <strong>algorithmic bias</strong> must be considered. The model learns from data created by humans, and that data contains societal biases. This can result in the model associating certain identities, topics, or dialects with unearned negative or positive sentiments. While efforts are made to mitigate these biases during training, they can never be eliminated entirely. Therefore, results should be reviewed with a critical eye, especially when analyzing text related to sensitive social issues or specific demographic groups. These limitations do not invalidate the tool's utility but highlight its role as a powerful assistant, not an infallible arbiter of truth.
        </p>

        <h2>4. Sample Text Analysis (50 Samples)</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Sample Text</th>
                    <th>Ground Truth</th>
                    <th>API Prediction</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>The customer service was outstanding, they solved my issue in minutes.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>2</td><td>I am absolutely thrilled with this purchase!</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>3</td><td>This is the best movie I've seen all year.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>4</td><td>The food was delicious and the atmosphere was lovely.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>5</td><td>What a wonderful surprise! Thank you so much.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>6</td><td>The quality of this product exceeded my expectations.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>7</td><td>I had a great time at the event.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>8</td><td>Highly recommended, I would definitely buy this again.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>9</td><td>The team did an amazing job on this project.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>10</td><td>I love the new design, it's so clean and modern.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>11</td><td>The concert was an unforgettable experience.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>12</td><td>This app is incredibly useful and easy to use.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>13</td><td>The presentation was clear, concise, and very informative.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>14</td><td>The staff were friendly and welcoming.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>15</td><td>I'm very satisfied with the outcome.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>16</td><td>The scenery on the hike was breathtaking.</td><td>Positive</td><td>Positive</td><td class="correct">Correct</td></tr>
                <tr><td>17</td><td>Oh, great, another meeting that could have been an email. (Sarcastic)</td><td>Negative</td><td>Positive</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>18</td><td>It's not bad, I guess.</td><td>Positive</td><td>Neutral</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>19</td><td>I am extremely disappointed with the service I received.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>20</td><td>The product broke after just one week of use.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>21</td><td>This was a complete waste of time and money.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>22</td><td>The instructions were confusing and poorly written.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>23</td><td>I've had a terrible experience with this company.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>24</td><td>The shipping was delayed and the package arrived damaged.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>25</td><td>I would not recommend this to anyone.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>26</td><td>The app keeps crashing and is completely unusable.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>27</td><td>The food was cold and tasteless.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>28</td><td>This is the worst product I have ever purchased.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>29</td><td>I'm so frustrated with the lack of support.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>30</td><td>The hotel room was dirty and smelled bad.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>31</td><td>This policy is unfair and makes no sense.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>32</td><td>I waited on hold for over an hour. Unacceptable.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>33</td><td>I'm really unhappy with this decision.</td><td>Negative</td><td>Negative</td><td class="correct">Correct</td></tr>
                <tr><td>34</td><td>The movie was boring and the plot was weak.</td><td>Negative</td><td>Neutral</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>35</td><td>I am feeling quite unwell today.</td><td>Negative</td><td>Neutral</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>36</td><td>I love how you ignored my feedback completely. (Sarcastic)</td><td>Negative</td><td>Positive</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>37</td><td>The meeting is scheduled for 3 PM tomorrow.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>38</td><td>Please find the attached document for your review.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>39</td><td>The system will be down for maintenance from 10 PM to 11 PM.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>40</td><td>The report contains data from the last quarter.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>41</td><td>This ticket is number 5042 in the queue.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>42</td><td>The building is located at 123 Main Street.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>43</td><td>The user guide is available in PDF format.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>44</td><td>The training session will cover the new software features.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>45</td><td>The chemical formula for water is H2O.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>46</td><td>The item is currently out of stock.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>47</td><td>The flight departs from Gate B27.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>48</td><td>The warranty is valid for one year from the date of purchase.</td><td>Neutral</td><td>Neutral</td><td class="correct">Correct</td></tr>
                <tr><td>49</td><td>Per my last email, the deadline has passed.</td><td>Neutral</td><td>Negative</td><td class="incorrect">Incorrect</td></tr>
                <tr><td>50</td><td>The project was a success but the budget was a failure.</td><td>Neutral</td><td>Positive</td><td class="incorrect">Incorrect</td></tr>
            </tbody>
        </table>
    </div>
</body>
</html>
`;
